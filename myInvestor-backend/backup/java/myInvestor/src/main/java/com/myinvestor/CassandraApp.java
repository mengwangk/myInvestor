package com.myinvestor;

import com.myinvestor.model.Exchange;
import lombok.extern.slf4j.Slf4j;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;

import java.io.Serializable;

import static com.datastax.spark.connector.japi.CassandraJavaUtil.*;

/**
 * Test app for Cassandra
 */
@Slf4j
public class CassandraApp implements Serializable {
    private transient SparkConf conf;

    private CassandraApp(SparkConf conf) {
        this.conf = conf;
    }

    private void run() {
        JavaSparkContext sc = new JavaSparkContext(conf);
        generateData(sc);
        compute(sc);
        showResults(sc);
        sc.stop();
    }

    private void generateData(JavaSparkContext sc) {
    }

    private void compute(JavaSparkContext sc) {
        JavaRDD<Exchange> rdd = javaFunctions(sc).cassandraTable("myinvestor", "exchange", mapRowTo(Exchange.class));
        Exchange exchange = rdd.first();
        log.info(exchange.toString());
    }

    private void showResults(JavaSparkContext sc) {
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.println("Syntax: CassandraApp <Spark Master URL> <Cassandra contact point>");
            System.exit(1);
        }

        SparkConf conf = new SparkConf();
        conf.setAppName("Java API demo");
        conf.setMaster(args[0]);
        conf.set("spark.cassandra.connection.host", args[1]);

        CassandraApp app = new CassandraApp(conf);
        app.run();
    }
}
