package com.myinvestor;

import lombok.extern.slf4j.Slf4j;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;

/**
 * Simple app for testing
 */
@Slf4j
public class SimpleApp {
    public static void main(String[] args) {
        String logFile = "C:\\myspace\\2016\\Development\\myStock\\spark-2.0.1-bin-hadoop2.7\\README.md"; // Should be some file on your system
        SparkConf conf = new SparkConf().setAppName("Simple App");
        JavaSparkContext sc = new JavaSparkContext(conf);
        JavaRDD<String> logData = sc.textFile(logFile).cache();

        long numAs = logData.filter(new Function<String, Boolean>() {
            public Boolean call(String s) {
                return s.contains("a");
            }
        }).count();

        long numBs = logData.filter(new Function<String, Boolean>() {
            public Boolean call(String s) {
                return s.contains("b");
            }
        }).count();

        log.debug("--------Lines with a: " + numAs + ", lines with b: " + numBs);
    }
}
