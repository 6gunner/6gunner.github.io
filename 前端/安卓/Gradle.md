# Gradle

## 安装Gradle

```bash
localhost:bhex-broker-app-android koda$ gradle -v

------------------------------------------------------------
Gradle 4.10.2
------------------------------------------------------------

Build time:   2018-09-19 18:10:15 UTC
Revision:     b4d8d5d170bb4ba516e88d7fe5647e2323d791dd

Kotlin DSL:   1.0-rc-6
Kotlin:       1.2.61
Groovy:       2.4.15
Ant:          Apache Ant(TM) version 1.9.11 compiled on March 23 2018
JVM:          1.8.0_171 (Oracle Corporation 25.171-b11)
OS:           Mac OS X 10.14.5 x86_64
```



## Groovy

Groovy基于java,并且拓展了java，了解Groovy语言是掌握Gradle的基础。



## DSL



## Gradle牛刀小试

### 构建sprint boot的引用

```groovy
plugins {
    id 'java'
    id 'com.gradle.build-scan' version '2.0.2'
    id 'org.springframework.boot' version '2.0.5.RELEASE'
    id 'io.spring.dependency-management' version '1.0.7.RELEASE'
}

repositories {
    // 本地仓库
    mavenLocal()
    jcenter()
}

dependencies {
    //spring boot
    implementation 'org.springframework.boot:spring-boot-dependencies:2.0.5.RELEASE'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    // 单元测试
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    components {
        withModule('org.springframework:spring-beans') {
            allVariants {
                withDependencyConstraints {
                    it.findAll{ it.name == 'snakeyaml' }.each {
                        it.version {
                            strictly '1.19'
                        }
                    }
                }
            }
        }
    }
}
//设置启动类
bootJar {
    mainClassName = 'demo.App'
}
// 用来向外发布依赖项
buildScan {
	termsOfServiceUrl = 'https://gradle.com/terms-of-service'
  termsOfServiceAgree = 'yes'
  publishAlways()
}
// https://gradle.com/s/t2f34h3cwseza
```



```shell
./gradlew bootRun #直接启动应用

./gradlew bootJar #打包应用jar到build/libs下面
java -jar build/libs/xxx.jar  #再通过java -jar来执行
```



Gradle示例

```groovy
buildscript {//运行首先执行这段代码
    ext {//用于定义动态属性
        //sringBootVersion 变量的定义
        springBootVersion = '2.0.0.RELEASE'
    }
    repositories {
        //mavenCentral() //官方的中央仓库
        maven {  //自定义中央仓库 下面是引用阿里的maven中央仓库
            url 'http://maven.aliyun.com/nexus/content/groups/public'
        }
    }
    dependencies {//依赖，下面是依赖springboot的一个插件
        //${springBootVersion} 就是引用上面动态属性的变量
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
    }
}

//使用了的插件
apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'

group = 'com.youngman'
version = '0.0.1-SNAPSHOT'//项目的版本号,用户可以自定义
sourceCompatibility = 1.8//JDK的版本

repositories {
    //mavenCentral()
    maven {
        url 'http://maven.aliyun.com/nexus/content/groups/public'
    }
}

//依赖
dependencies {
    compile('org.springframework.boot:spring-boot-starter-data-jpa')
    compile('org.springframework.boot:spring-boot-starter-security')
    compile('org.springframework.boot:spring-boot-starter-web')
    testCompile('org.springframework.boot:spring-boot-starter-test')
    testCompile('org.springframework.security:spring-security-test')
}

gradlew: gradlew环境的脚本，我们执行就会完成环境一个搭建
build: gradlew 项目构建之后自动生成的一个目录
gradle: 里面有个子目录 wrapper项目成员没有安装gradle就会自动安装gradle，好处就是统一gradle的版本
src: 项目源码，包含程序源码和测试源码
.idea: 存放项目的配置信息。这个文件夹是自动生成，版本控制信息等，包括历史记录
settings.gradle: 针对module的全局配置，它的作用域所包含的所有module是通过settings.gradle来配置

```





# 安卓构建

## 构建类型

构建类型一般分为`测试构建`和`发布构建`两种模式。不同的构建模式会用不同的`签署密钥`。必须至少定义一个构建类型，才能够构建应用。

## Build配置文件



