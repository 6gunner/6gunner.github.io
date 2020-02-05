

> https://www.docs4dev.com/docs/zh/log4j2/2.x/all/manual-configuration.html#Property_Substitution



pom依赖文件

```xml
<!-- sl4j -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.13</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
            <version>1.7.13</version>
            <scope>runtime</scope>
        </dependency>

        <!--核心log4j2jar包-->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>2.4.1</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>2.4.1</version>
        </dependency>
```





Log4j2.xml配置文档

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--        status用来指定log4j本身的打印日志的级别.-->
<Configuration status="INFO" monitorInterval="30">

    <Properties>
        <Property name="appName">gsoms-web</Property>
        <Property name="filePath">../logs/${appName}</Property>
        <Property name="fileSize">10MB</Property>
        <Property name="pattern">%d{yyyy-MM-dd HH:mm:sss} [%p] - %l - %m%n</Property>
    </Properties>

    <!--定义所有的appender -->
    <Appenders>
        <!--这个输出控制台的配置 -->
        <Console name="Console" target="SYSTEM_OUT">
            <!--输出日志的格式 -->
            <PatternLayout
                    pattern="${pattern}"/>
        </Console>

        <!-- 这个会打印出所有的info及以下级别的信息，每次大小超过size，则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，作为存档 -->
        <RollingFile name="RollingFileInfo"
                     fileName="${filePath}/info.log"
                     filePattern="${filePath}/%d{yyyy-MM-dd}/info-%i.log.gz">

            <ThresholdFilter level="info" onMatch="ACCEPT"
                             onMismatch="DENY"/>
            <PatternLayout
                    pattern="${pattern}"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
                <SizeBasedTriggeringPolicy size="${fileSize}"/>
            </Policies>
        </RollingFile>

        <RollingFile name="RollingFileWarn"
                     fileName="${filePath}/warn.log"
                     filePattern="${filePath}/%d{yyyy-MM-dd}/warn-%i.log.gz">

            <ThresholdFilter level="warn" onMatch="ACCEPT"
                             onMismatch="DENY"/>
            <PatternLayout
                    pattern="${pattern}"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
                <SizeBasedTriggeringPolicy size="${fileSize}"/>
            </Policies>
            <!-- DefaultRolloverStrategy属性如不设置，则默认为最多同一文件夹下7个文件，这里设置了10 -->
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>

        <RollingFile name="RollingFileError"
                     fileName="${filePath}/error.log"
                     filePattern="${filePath}/%d{yyyy-MM-dd}/error-%i.log.gz">
            <ThresholdFilter level="error" onMatch="ACCEPT"
                             onMismatch="DENY"/>
            <PatternLayout
                    pattern="${pattern}"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
                <SizeBasedTriggeringPolicy size="${fileSize}"/>
            </Policies>
        </RollingFile>
    </Appenders>

    <!--然后定义logger，只有定义了logger并引入的appender，appender才会生效-->
    <Loggers>
        <!--过滤掉第三方的一些无用的DEBUG信息 -->
        <Logger name="org.springframework" level="INFO"/>
        <Logger name="org.apache.commons" level="INFO"/>
        <Logger name="org.mybatis" level="INFO"/>
        <Logger name="com.gs.net" level="INFO"/>

        <!-- Logger也可以定义子节点AppenderRef，用来指定该日志输出到哪个Appender,如果没有指定，就会默认继承自Root.
        如果指定了，那么会在指定的这个Appender和Root的Appender中都会输出。
        此时我们可以设置Logger的additivity="false"只在自定义的Appender中进行输出。-->

        <Logger name="com.ld.web" level="INFO" additivity="false">
            <AppenderRef ref="RollingFileError"/>
            <AppenderRef ref="RollingFileWarn"/>
            <AppenderRef ref="RollingFileInfo"/>
        </Logger>

        <!-- Root节点用来指定项目的根日志，如果没有单独指定Logger，那么就会默认使用该Root日志输出 -->
        <Root level="all">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="RollingFileInfo"/>
            <AppenderRef ref="RollingFileWarn"/>
            <AppenderRef ref="RollingFileError"/>
        </Root>


    </Loggers>
</Configuration>
```



输出格式：

![image-20200116112945450](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-032945.png)

