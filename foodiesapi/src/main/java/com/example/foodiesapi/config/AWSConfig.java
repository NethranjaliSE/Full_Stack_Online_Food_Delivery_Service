package com.example.foodiesapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AWSConfig {
    @Value("${aws.access.key}")
    private String accessKey;
    @Value("${aws.secret.key}")
    private String secretKey;
    @Value("${aws.region}")
    private String region;
    @Value("${aws.s3.bucketname}")
    private String bucketName;

    @Bean
    public S3Client s3Client() {
        System.out.println("Initializing S3 Client with region: " + region);
        System.out.println("AWS Access Key (First 4 chars): "
                + (accessKey != null ? accessKey.substring(0, Math.min(accessKey.length(), 4)) : "null"));
        System.out.println("Target Bucket: " + bucketName);

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }
}
