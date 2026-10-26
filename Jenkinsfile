// ─── JENKINS DECLARATIVE PIPELINE ────────────────────────────────────────────
// Jenkins is a self-hosted CI/CD server (your company runs it on its own infra).
// GitHub Actions is cloud-hosted (GitHub's servers). Both do the same job.
//
// When to choose Jenkins over GitHub Actions:
//   - Your company has security rules against sending code to GitHub's cloud runners
//   - You need tests to hit internal/VPN-protected environments
//   - You already have Jenkins set up for other projects
//
// Setup: Place this file at the root of your repo. In Jenkins → New Item →
// Pipeline → Pipeline script from SCM → point to your repo + "Jenkinsfile"
// ─────────────────────────────────────────────────────────────────────────────

pipeline {
    agent any   // Runs on any available Jenkins agent (build server)

    // How long before Jenkins kills a hung build
    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))  // Keep last 10 builds
        disableConcurrentBuilds()  // Don't run two builds of the same branch at once
    }

    // Parameters let you pass options when triggering a build manually from Jenkins UI
    parameters {
        string(
            name: 'TEST_FILE',
            defaultValue: '',
            description: 'Specific test file to run (leave blank for all tests)'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Browser to run tests on'
        )
        string(
            name: 'GREP_TAG',
            defaultValue: '',
            description: 'Filter tests by tag: @smoke, @regression, @api (blank = all)'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run in headed mode (only works if Jenkins has a display)'
        )
    }

    // Environment variables — secrets come from Jenkins Credentials store
    // Configure at: Jenkins → Manage Jenkins → Credentials
    environment {
        CI = 'true'
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')  // Jenkins secret
        // Set URL based on branch
        BASE_URL = "${env.BRANCH_NAME ==~ /^(main|master)$/ ? 'https://production.yourcompany.com' : 'https://sandbox.yourcompany.com'}"
        NODE_ENV = "${env.BRANCH_NAME ==~ /^(main|master)$/ ? 'production' : 'development'}"
    }

    stages {
        // ── Stage 1: Install dependencies ───────────────────────────────────
        stage('Install Dependencies') {
            steps {
                echo "Installing npm packages..."
                sh 'npm ci'   // Always npm ci (not npm install) for reproducible builds
            }
        }

        // ── Stage 2: Install Playwright browsers ────────────────────────────
        stage('Install Browsers') {
            steps {
                echo "Installing Playwright ${params.BROWSER} browser..."
                sh "npx playwright install --with-deps ${params.BROWSER}"
            }
        }

        // ── Stage 3: Run tests ───────────────────────────────────────────────
        stage('Run Tests') {
            steps {
                script {
                    // Build the test command dynamically based on parameters
                    def cmd = "npx playwright test --project=${params.BROWSER}"

                    if (params.TEST_FILE?.trim()) {
                        cmd += " ${params.TEST_FILE}"
                    }
                    if (params.GREP_TAG?.trim()) {
                        cmd += " --grep '${params.GREP_TAG}'"
                    }
                    if (params.HEADED) {
                        cmd += " --headed"
                    }

                    echo "Executing: ${cmd}"
                    echo "Environment: ${env.NODE_ENV} → ${env.BASE_URL}"

                    sh cmd
                }
            }
        }
    }

    // ── Post-build actions (always run, even on failure) ────────────────────
    post {
        always {
            // Publish HTML report in Jenkins using the HTML Publisher plugin
            // Install plugin: Jenkins → Manage Jenkins → Plugin Manager → HTML Publisher
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                reportTitles: 'Test Report'
            ])

            // Archive videos and screenshots from failing tests
            archiveArtifacts(
                artifacts: 'test-results/**/*',
                allowEmptyArchive: true,
                fingerprint: true
            )

            // Clean workspace after build to save disk space
            cleanWs()
        }

        success {
            echo "✅ All Playwright tests passed on branch: ${env.BRANCH_NAME}"
            // OPTIONAL: Send Slack notification on success
            // slackSend(color: 'good', message: "✅ Tests passed: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }

        failure {
            echo "❌ Playwright tests failed on branch: ${env.BRANCH_NAME}"
            // OPTIONAL: Send Slack notification on failure
            // slackSend(color: 'danger', message: "❌ Tests failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} — ${env.BUILD_URL}")

            // OPTIONAL: Send email notification
            // emailext(
            //     subject: "❌ Test Failure: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //     body: "Tests failed. View report: ${env.BUILD_URL}",
            //     recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            // )
        }
    }
}
