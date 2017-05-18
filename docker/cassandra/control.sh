#!/bin/bash

DOCKER_HUB_USER=mengwangk
BUILD_TAG=$DOCKER_HUB_USER/myinvestor-cassandra
RUN_NAME=myinvestor-db
DB_DIR=$HOME/$RUN_NAME
DB_SCRIPT_DIR=$HOME/$RUN_NAME-staging

build() {
    echo
    echo "==== build ===="

    sudo docker build -t $BUILD_TAG .   

    echo   
}

start() {

    echo
    echo "==== start ===="

	# Create folder if not exists
	[ -d $DB_DIR ] || mkdir -p $DB_DIR
	[ -d $DB_SCRIPT_DIR ] || mkdir -p $DB_SCRIPT_DIR

    sudo docker run --name $RUN_NAME -v $DB_DIR:/var/lib/cassandra -v $DB_SCRIPT_DIR:/staging -d -p 7199:7199 -p 7000:7000 -p 7001:7001 -p 9160:9160 -p 9042:9042 $BUILD_TAG   

    echo    
}

stop() {

    echo
    echo "==== stop ===="

    sudo docker stop $RUN_NAME   
    sudo docker rm $RUN_NAME   

    echo    
}

status() {

    echo
    echo "==== status ===="

    sudo docker ps -a | grep $RUN_NAME

    echo    
}

cqlsh() {

    echo
    echo "==== cqlsh ===="

	# Create folder if not exists
	[ -d $DB_SCRIPT_DIR ] || mkdir -p $DB_SCRIPT_DIR

	sudo docker run -it -v $DB_SCRIPT_DIR:/staging --link $RUN_NAME:cassandra --rm cassandra sh -c 'exec cqlsh "$CASSANDRA_PORT_9042_TCP_ADDR"'
	
	echo
}

command() {

    echo
    echo "==== command ===="

	sudo docker exec -it $RUN_NAME bash
	
	echo
}

push(){
    echo
    echo "==== push ===="
	TAG=`sudo docker images | grep $BUILD_TAG | awk '{print $3}'`
	echo "Pushing $TAG to Docker Hub"
	#sudo docker tag $TAG $DOCKER_HUB_USER/$BUILD_TAG:latest
	sudo docker push $BUILD_TAG

	echo
}


case "$1" in
    'build')
            build
            ;;
    'start')
            start
            ;;
    'stop')
            stop 
            ;;
    'status')
            status
            ;;
    'restart')
            stop ; echo "Sleeping..."; sleep 1 ;
            start
            ;;
    'cqlsh')
            cqlsh 
            ;;
    'command')
            command
            ;;
    'push')
            push 
            ;;
    *)
            echo
            echo "Usage: $0 { build | start | stop | restart | status | cqlsh | command | push }"
            echo
            exit 1
            ;;
esac

exit 0
