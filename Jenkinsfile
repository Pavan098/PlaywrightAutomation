// ─── JENKINS DECLARATIVE PIPELINE (Docker) ────────────────────────────────────
// Uses Microsoft's official Playwright Docker image as the build agent.
// Jenkins pulls the image and runs the entire pipeline inside it.
//
// WHY DOCKER AGENT?
//   - No need to install Node.js or browsers on the Jenkins server itself
//   - Every build runs in a fresh, identical environment
//   - Browser versions are pinned to the image tag — no surprise upgrades
//   - Matches GitHub Actions environment exactly (both Linux + same Playwright version)
//
// JENKINS REQUIREMENTS:
//   - Docker installed on the Jenkins server/agent
//   - Docker Pipeline plugin (Manage Jenkins → Plugin Manager)
//   - HTML Publisher plugin (for the test report)
//   - Credentials: 'anthropic-api-key' (optional, for AI self-healing)
//
// SETUP:
//   Jenkins → New Item → Pipeline → Pipeline script from SCM → point to this repo
// ─────────────────────────────────────────────────────────────────────────────

pipeline {

    // ── Docker agent ─────────────────────────────────────────────────────────
    // Jenkins pulls this image and runs every stage inside the container.
    // --ipc=host  → Chromium needs shared memory; this flag grants access
    // -u root     → Avoid permission issues when writing reports
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.49.0-noble'
            args  '--ipc=host -u root'
        }
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    parameters {
        string(
            name: 'TEST_FILE',
            defaultValue: '',
            description: 'Specific test file to run (blank = all tests)'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Browser to run tests on'
        )
        string(
            name: 'GREP_TAG',
            defaultValue: '',
            description: 'Filter by tag: @smoke | @regression | @api (blank = all)'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run headed (requires Jenkins agent with a display / Xvfb)'
        )
    }

    environment {
        CI           = 'true'
        BASE_URL     = "${env.BRANCH_NAME ==~ /^(main|master)$/ ? 'https://rahulshettyacademy.com' : 'https://rahulshettyacademy.com'}"
        NODE_ENV     = "${env.BRANCH_NAME ==~ /^(main|master)$/ ? 'production' : 'development'}"
        // Store ANTHROPIC_API_KEY in Jenkins Credentials (ID: anthropic-api-key)
        // Remove the next line if you don't use AI self-healing
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
    }

    stages {

        // ── Stage 1: Install npm dependencies ─────────────────────────────────
        // Browsers are already in the Docker image — no playwright install needed!
        stage('Install Dependencies') {
            steps {
                echo "Installing npm packages inside Docker container..."
                sh 'node --version && npm --version'
                sh 'npm ci'
            }
        }

        // ── Stage 2: Run Playwright tests ─────────────────────────────────────
        stage('Run Tests') {
            steps {
                script {
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

                    echo "Branch     : ${env.BRANCH_NAME}"
                    echo "Environment: ${env.NODE_ENV} → ${env.BASE_URL}"
                    echo "Command    : ${cmd}"

                    sh cmd
                }
            }
        }
    }

    // ── Post-build actions ────────────────────────────────────────────────────
    post {
        always {
            // Publish Playwright HTML report
            // Requires: HTML Publisher plugin
            publishHTML([
                allowMissing         : true,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                reportName           : 'Playwright Test Report',
                reportTitles         : ''
            ])

            // Archive failure screenshots, videos, and traces
            archiveArtifacts(
                artifacts        : 'test-results/**/*',
                allowEmptyArchive: true,
                fingerprint      : true
            )

            cleanWs()
        }

        success {
            echo "✅ All tests passed — ${env.JOB_NAME} #${env.BUILD_NUMBER} on ${env.BRANCH_NAME}"
            // Uncomment after adding SLACK_WEBHOOK to Jenkins Credentials:
            // slackSend(color: 'good', message: "✅ *${env.JOB_NAME}* #${env.BUILD_NUMBER} passed on `${env.BRANCH_NAME}` <${env.BUILD_URL}|View>")
        }

        failure {
            echo "❌ Tests failed — ${env.JOB_NAME} #${env.BUILD_NUMBER} on ${env.BRANCH_NAME}"
            // Uncomment after adding SLACK_WEBHOOK to Jenkins Credentials:
            // slackSend(color: 'danger', message: "❌ *${env.JOB_NAME}* #${env.BUILD_NUMBER} failed on `${env.BRANCH_NAME}` <${env.BUILD_URL}|View Report>")
        }
    }
}
