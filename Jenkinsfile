pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_TARGET',
            choices: ['both', 'kahitoz', 'naman'],
            description: 'Select deployment target'
        )
    }

    environment {
        IMAGE_NAME = "halfskirmish-weather"
        PRIMARY_REGISTRY = "registrypush.kahitoz.com:5000"
        SECONDARY_REGISTRY = "registry.kahitoz.com"
        DOCKER_CREDS = credentials('docker_creds')
        KAHITOZ_HOST = "tcp://kahitozrunner:2375"
        NAMAN_HOST = "tcp://naman:2375"
        APP_NETWORK = "app"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${IMAGE_NAME}"
                    sh """
                        docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                        docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing images to both registries"
                    sh """
                        # Login to registries
                        echo \${DOCKER_CREDS_PSW} | docker login ${PRIMARY_REGISTRY} -u \${DOCKER_CREDS_USR} --password-stdin
                        echo \${DOCKER_CREDS_PSW} | docker login ${SECONDARY_REGISTRY} -u \${DOCKER_CREDS_USR} --password-stdin
                        
                        # Push to primary registry
                        docker tag ${IMAGE_NAME}:latest ${PRIMARY_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker tag ${IMAGE_NAME}:latest ${PRIMARY_REGISTRY}/${IMAGE_NAME}:latest
                        docker push ${PRIMARY_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${PRIMARY_REGISTRY}/${IMAGE_NAME}:latest
                        
                        # Push to secondary registry
                        docker tag ${IMAGE_NAME}:latest ${SECONDARY_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker tag ${IMAGE_NAME}:latest ${SECONDARY_REGISTRY}/${IMAGE_NAME}:latest
                        docker push ${SECONDARY_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${SECONDARY_REGISTRY}/${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy to Docker Socket') {
            steps {
                script {
                    def deployHosts = []
                    
                    // Determine deployment targets
                    if (params.DEPLOY_TARGET == 'both') {
                        deployHosts = [
                            [name: 'kahitoz', host: env.KAHITOZ_HOST],
                            [name: 'naman', host: env.NAMAN_HOST]
                        ]
                    } else if (params.DEPLOY_TARGET == 'kahitoz') {
                        deployHosts = [[name: 'kahitoz', host: env.KAHITOZ_HOST]]
                    } else {
                        deployHosts = [[name: 'naman', host: env.NAMAN_HOST]]
                    }
                    
                    // Deploy in parallel if both targets selected
                    if (params.DEPLOY_TARGET == 'both') {
                        def parallelDeploy = [:]
                        
                        deployHosts.each { target ->
                            parallelDeploy[target.name] = {
                                deployToHost(target.host, target.name)
                            }
                        }
                        
                        parallel parallelDeploy
                    } else {
                        // Deploy to single target
                        deployToHost(deployHosts[0].host, deployHosts[0].name)
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Weather App deployment completed successfully!"
            echo "Image: ${IMAGE_NAME}:${BUILD_NUMBER} | Target: ${params.DEPLOY_TARGET}"
        }
        failure {
            echo "❌ Deployment failed. Please check the logs."
        }
        always {
            script {
                echo "Cleaning up Docker resources"
                sh """
                    docker logout ${PRIMARY_REGISTRY} || true
                    docker logout ${SECONDARY_REGISTRY} || true
                    docker image prune -f || true
                    docker container prune -f || true
                """
            }
        }
    }
}

// Helper function to deploy to a specific host
def deployToHost(String dockerHost, String targetName) {
    echo "Deploying Weather App to ${targetName} (${dockerHost})"
    
    sh """
        # Authenticate remote Docker with registry
        docker -H ${dockerHost} login ${PRIMARY_REGISTRY} -u \${DOCKER_CREDS_USR} -p \${DOCKER_CREDS_PSW}
        
        # Create app network if not exists
        docker -H ${dockerHost} network inspect ${APP_NETWORK} >/dev/null 2>&1 || \
        docker -H ${dockerHost} network create ${APP_NETWORK}
        
        # Pull the latest image
        docker -H ${dockerHost} pull ${PRIMARY_REGISTRY}/${IMAGE_NAME}:latest
        
        # Stop and remove existing container
        docker -H ${dockerHost} stop ${IMAGE_NAME} || true
        docker -H ${dockerHost} rm ${IMAGE_NAME} || true
        
        # Run new container
        docker -H ${dockerHost} run -d \\
            --name ${IMAGE_NAME} \\
            --network ${APP_NETWORK} \\
            --restart unless-stopped \\
            ${PRIMARY_REGISTRY}/${IMAGE_NAME}:latest
        
        # Verify deployment
        docker -H ${dockerHost} ps | grep ${IMAGE_NAME}
    """
    
    echo "✅ Weather App deployed successfully to ${targetName}"
}