FROM ubuntu:latest

MAINTAINER mengwangk@gmail.com

####installing [software-properties-common] so that we can use [apt-add-repository] to install Java8
RUN apt-get update && apt-get install -y --no-install-recommends \
software-properties-common \
sudo \
&&  apt-add-repository ppa:webupd8team/java -y \
&& apt-get update \

####automatically agreeing on oracle license agreement [for installing java]
&&  echo debconf shared/accepted-oracle-license-v1-1 select true | sudo debconf-set-selections \
&&  echo debconf shared/accepted-oracle-license-v1-1 seen true | sudo debconf-set-selections \

####installing java and supervisor
&&  apt-get install -y --no-install-recommends \
	oracle-java8-installer \
    supervisor


####downloading & unpacking Spark 2.0.2 [prebuilt for Hadoop 2.7+ and scala 2.10]
RUN wget http://www-us.apache.org/dist/spark/spark-2.0.2/spark-2.0.2-bin-hadoop2.7.tgz \
&&  tar -xzf spark-2.0.2-bin-hadoop2.7.tgz \
&&  mv spark-2.0.2-bin-hadoop2.7 /opt/spark


#####adding conf files [to be used by supervisord for running spark master/slave]
COPY master.conf /opt/conf/master.conf
COPY slave.conf /opt/conf/slave.conf


#######exposing ports
EXPOSE 8080
EXPOSE 8081
EXPOSE 7077

#default command: running an interactive spark shell in the local mode
CMD ["/opt/spark/bin/spark-shell", "--master", "local[*]"]
