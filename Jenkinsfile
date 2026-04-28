pipeline {
  agent any

  tools {
    nodejs 'node-20'
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Quality Gate') {
      steps {
        sh 'npm run lint:types'
      }
    }

    stage('Cypress E2E') {
      steps {
        sh 'npm test'
      }
      post {
        always {
          archiveArtifacts allowEmptyArchive: true, artifacts: 'cypress/screenshots/**, cypress/videos/**, allure-results/**'
          allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
