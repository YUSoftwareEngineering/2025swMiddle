plugins {
	java
	id("org.springframework.boot") version "3.5.7"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
description = "Demo project for Spring Boot"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {

	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-security")

	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	implementation("org.projectlombok:lombok")

	implementation("io.jsonwebtoken:jjwt-api:0.12.5")
	implementation("io.jsonwebtoken:jjwt-impl:0.12.5")
	implementation("io.jsonwebtoken:jjwt-jackson:0.12.5")

	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")


	annotationProcessor("org.projectlombok:lombok")
	testAnnotationProcessor("org.projectlombok:lombok")

	runtimeOnly("com.h2database:h2") // 일단 혼자 테스트용으로 H2 메모리 DB사용
	runtimeOnly("com.mysql:mysql-connector-j")

	// runtimeOnly("com.mysql:mysql-connector-j")


	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	// �쑀�슚�꽦 寃��궗 (�엯�젰媛� 泥댄겕) [cite: 1484]
	implementation ("org.springframework.boot:spring-boot-starter-validation")
	// H2 �뜲�씠�꽣踰좎씠�뒪 (�룄而� ���떊 濡쒖뺄 �뀒�뒪�듃�슜)

}

tasks.withType<Test> {
	useJUnitPlatform()
}

