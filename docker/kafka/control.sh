#!/bin/bash

DOCKER_HUB_USER=mengwangk
BUILD_TAG=$DOCKER_HUB_USER/myinvestor-kafka
RUN_NAME=myinvestor-streaming
ZOOKEEPER="--zookeeper localhost:2181"
BROKER_LIST="--broker-list localhost:9092"

ARGS=$@

build() {
    echo
    echo "==== build ===="

    sudo docker build -t $BUILD_TAG .   

    echo   
}

start() {

    echo
    echo "==== start ===="

    sudo docker run --name $RUN_NAME -d -p 2181:2181 -p 9092:9092 $BUILD_TAG
	#--env ADVERTISED_HOST=`sudo docker-machine ip \`sudo docker-machine active\`` --env ADVERTISED_PORT=9092 $BUILD_TAG

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

command() {

    echo
    echo "==== command ===="

    sudo docker exec -it $RUN_NAME bash
	
    echo
}

zookeeper() {
    echo
    echo "==== zookeeper ===="

    sudo docker exec -it $RUN_NAME /usr/share/zookeeper/bin/zkCli.sh -server 127.0.0.1:2181
	
    echo
}

topic () {
    echo
    echo "==== topic ===="
  
    TOPIC_ARGS=""  
    COUNT=0 
    for arg in $ARGS
    do
       COUNT=$((COUNT + 1))
       if [ "$COUNT" != "1" ]; then
	  TOPIC_ARGS+=" "
          TOPIC_ARGS+=$arg
       fi
    done
    #echo $TOPIC_ARGS
    sudo docker exec -it $RUN_NAME /opt/kafka_2.11-0.10.1.0/bin/kafka-topics.sh $ZOOKEEPER $TOPIC_ARGS
	
    echo
}

producer() {
    echo
    echo "==== producer  ===="
  
    PRODUCER_ARGS=""  
    COUNT=0 
    for arg in $ARGS
    do
       COUNT=$((COUNT + 1))
       if [ "$COUNT" != "1" ]; then
	  PRODUCER_ARGS+=" "
          PRODUCER_ARGS+=$arg
       fi
    done
    sudo docker exec -it $RUN_NAME /opt/kafka_2.11-0.10.1.0/bin/kafka-console-producer.sh $BROKER_LIST --topic $PRODUCER_ARGS
	
    echo
}

consumer() {
    echo
    echo "==== consumer ===="
  
    CONSUMER_ARGS=""  
    COUNT=0 
    for arg in $ARGS
    do
       COUNT=$((COUNT + 1))
       if [ "$COUNT" != "1" ]; then
	  CONSUMER_ARGS+=" "
          CONSUMER_ARGS+=$arg
       fi
    done
    sudo docker exec -it $RUN_NAME /opt/kafka_2.11-0.10.1.0/bin/kafka-console-consumer.sh $ZOOKEEPER --topic $CONSUMER_ARGS --from-beginning
	
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
    'command')
            command
            ;;
    'push')
            push 
            ;;
    'zookeeper')
            zookeeper
            ;;
    'topic')
            topic 
            ;;
    'producer')
            producer 
            ;;
    'consumer')
            consumer
            ;;
    *)
            echo
            echo "Usage: $0 { build | start | stop | restart | status | command | push | zookeeper | topic | producer | consumer}"
            echo
            exit 1
            ;;
esac

exit 0
