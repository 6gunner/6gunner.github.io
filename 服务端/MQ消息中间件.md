# MQ

### MQ安装部署

MQ安装

> https://www.jianshu.com/p/60c358235705

MQ启动

```shell
➜  ~ sudo rabbitmq-server -detached
```

MQ管理端

```properties
host=http://localhost:15672/
user=guest
password=guest
```





### 使用场景

1.解耦

当A服务需要被多个服务引用时，不需要频繁的修改A服务的接口，只需要对外提供一个统一的消息队列，需要用到的服务去订阅这个消息队列就可以；

2.异步处理请求

有一些业务场景：比如发送邮件、发送短信等。如果是同步的情况，需要等邮件发送后再返回请求；那如果是异步的话，就可以将发送邮件、发送短信的任务加入到消息队列中，直接返回响应结果；

3.削峰

场景: 秒杀活动，一般会因为流量过大，导致应用挂掉。为了解决这个问题，一般会将请求加入消息队列。 

1.用户的请求,服务器收到之后,首先写入消息队列,加入消息队列长度超过最大值,则直接抛弃用户请求或跳转到错误页面. 

2.秒杀业务根据消息队列中的请求信息，再做后续处理.






### MQ通信方式

**通信协议**：`amqp协议`



### 消息队列

#### 简单消息队列

<img src="https://www.rabbitmq.com/img/tutorials/python-one.png" />

```java
// 生产者 -- Producer.java
connection = connectionFactory.newConnection();
channel = connection.createChannel();
// 声明通道队列
channel.queueDeclare(QUEUE_NAME, false, false, false, null);
String message = "Hello World";
channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
System.out.println(" [x] Sent '" + message + "'");

// 消费者 -- Receiver.java
Consumer consumer = new Consumer() {
  @Override
  public void handleDelivery(String s, Envelope envelope, AMQP.BasicProperties basicProperties, byte[] bytes) throws IOException {
    String message = new String(bytes, "UTF-8");
    System.out.println("[X] recived" + message);
  }
};
channel.basicConsume(TASK_QUEUE_NAME, autoAck, consumer);
```



缺点：1.耦合性高，生产者1-1对应消费者。无法用多个消费者去处理消息队列；

2.队列名变更时，需要同时变更生产者和消费者的代码；



#### Work Queues(消息分发)



![image-20190927183530447](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020216.png)

一个队列可以分配给多个消费者

##### Round-robin dispatching (轮询分发)

> 消息客户端平均分配所有的消息队列，无论消费者的处理能力如何，每个消费者都会轮流处理一个消息；
>
> 消息发送后会自动删除队列的消息；

```java
// consumer.java 消费者
try {
	Connection connection = connectionFactory.newConnection();
  Channel channel = connection.createChannel();
  // 声明队列
  channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);
  DeliverCallback deliverCallback = (tag, delivery) -> {
    String message = new String(delivery.getBody(), "UTF-8");
    try {
      doWork(message);
      System.out.println("[X] recived" + message);
    } finally {
    }
  };
  // 自动发送确认回执
  boolean autoAck = true;
  channel.basicConsume(TASK_QUEUE_NAME, autoAck, deliverCallback, consumerTag -> {
  });
} catch (Exception e) {
  e.printStackTrace();
}
```



##### Fair dispatching (公平分发)

> 限制每次消息发送者只发送1个消息，并且等待消费者发送消息确认ack，才会去删除消息队列；
>
> 注：需要关闭自动Ack, 并且当消费者处理完消息后，手动返回Ack确认。

**关键设置**：qos

在非自动确认消息的前提下，如果一定数量的消息未被确认，不进行新的消息消费；

- void BasicQos(uint prfetchSize,ushort prefetchCount,bool global);

**参数解释：**
*prefetchSize*: 消息的限制大小，消息多少兆。一般不做限制，设置为0

*prefetchCount*: 会告诉RabbitMQ不要同时给一个消费者推送多于N个消息，即一旦有N个消息还没有ack，则该consumer将block掉，直到有消息ack。一般设置为1

*global*:  true\false 是否将上面设置应用于channel。true 表示channel级别，false表示在consumer级别

```java
// Consumer.java
Connection connection = connectionFactory.newConnection();
Channel channel = connection.createChannel();
// 声明队列
channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);
// qos(服务质量保证)功能
channel.basicQos(1);
DeliverCallback deliverCallback = (tag, delivery) -> {
  String message = new String(delivery.getBody(), "UTF-8");
  System.out.println("[X] recived" + message);
  try {
    doWork(message);
  } finally {
    // 手动确认，如果忘记，消息一直无法确认，会内存溢出
    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
  }
};
// 取消自动发送确认回执
boolean autoAck = false;
channel.basicConsume(TASK_QUEUE_NAME, autoAck, deliverCallback, consumerTag -> {
});
```

如果忘了确认消息，那么会堵塞住：

![image-20191002094429036](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020211.png)





#### MQ发布订阅

##### Exchange消息交换机

> Exchange主要用来将消息转发到不同的队列



##### **Fanout模式**

> 不处理routing key, 所有消息都会到绑定的queue。所有的消息都通过exchange转发到所有绑定的队列上去

![174578-20180524175832191-777772730](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-20212.png)

<img src="https://www.rabbitmq.com/img/tutorials/python-three-overall.png" />

1.一个生产者对应多个消费者

2.每个消费者有自己的消息队列

3.生产者的消息不直接发往队列，而是通过交换机(exchange)来发送

4.每个队列的要和交换机绑定

```java
//Publisher.java
// 声明交换机
 channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);
// 发送了一个routingKey是“空字符串”的消息
 channel.basicPublish(EXCHANGE_NAME, "", null, message.getBytes());
  
// Sub.java
// 声明exchange
channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);
String queueName = channel.queueDeclare().getQueue();
// 绑定exchange
channel.queueBind(queueName, EXCHANGE_NAME, "");
DeliverCallback deliverCallback = (consumerTag, delivery) -> {
  String message = new String (delivery.getBody(), "UTF-8");
  System.out.println(" [x] Receive '" + message + "'");
};
channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {});
```

控制台界面：

![image-20190928110243950](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020215.png)

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-09-28-025845.png" alt="image-20190928105844979" style="zoom:50%;" />



##### 路由模式 direct

> 路由模式增加了一层 `routing-key`和`消息-key`的绑定关系
> 实际上，routing模式声明的exchange type是DIRECT类型

direct模式：处理routing key.

`Direct`要求该消息的路由键**完全匹配**。

![174578-20180524175810062-1941410843](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020210.png)
<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-09-28-032840.png" alt="image-20190928112840060" style="zoom:50%;" />

```java
// Publishe.java
try {
  connrection = connectionFactory.newConnection();
  channel = connection.createChannel();
  // 声明交换机类型
  channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
  // 发布了一个routingKey的消息
  channel.basicPublish(EXCHANGE_NAME, routingKey, null, message.getBytes());
} catch (Exception e) {
  e.printStackTrace();
}

// Subscriber.java
try {
  connection = connectionFactory.newConnection();
  channel = connection.createChannel();
  // 声明exchange
  channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.DIRECT);
  String queueName = channel.queueDeclare("queue_info", false, false, false, null)
    .getQueue();
  // 绑定exchange，最后参数是routing-key
  channel.queueBind(queueName, EXCHANGE_NAME, "info");
  channel.queueBind(queueName, EXCHANGE_NAME, "error");
  channel.queueBind(queueName, EXCHANGE_NAME, "warning");

  DeliverCallback deliverCallback = (consumerTag, delivery) -> {
    String message = new String (delivery.getBody(), "UTF-8");
    System.out.println(" [x] Receive '" + message + "'");
  };
  channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {});
} catch (Exception e) {
  e.printStackTrace();
}

```

控制台结果
<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-09-28-035111.png" height="300"/>





##### 主题模式 topic

> topic模式：可以用通配符来匹配routing key。将routing-key和bingd-key用通配符的模式订阅

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-01-005920.png" alt="174578-20180524175844359-92574693" style="zoom:80%;" />

- \* (star) 能匹配任意1个词.
- \# (hash) 可以匹配0或者多个词.

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-09-28-041435.png" alt="image-20190928121435095" style="zoom:50%;" />

```java
// Publisher.java
try {
  connection = connectionFactory.newConnection();
  channel = connection.createChannel();
  // 声明交换机
  channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.TOPIC);
  channel.basicPublish(EXCHANGE_NAME, type, null, message.getBytes());
  System.out.println(" [x] Sent '" + message + "'");
} catch (Exception e) {
  e.printStackTrace();
}

// Sub.java
try {
  connection = connectionFactory.newConnection();
  channel = connection.createChannel();
  // 声明exchange
  channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.TOPIC);
  String queueName = channel.queueDeclare("queue_kern.*", false, false, false, null)
    .getQueue();
  // 绑定exchange
  channel.queueBind(queueName, EXCHANGE_NAME, "kern.*");

  DeliverCallback deliverCallback = (consumerTag, delivery) -> {
    String message = new String (delivery.getBody(), "UTF-8");
    System.out.println(" [x] Receive '" + message + "'");
  };
  channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {});
} catch (Exception e) {
  e.printStackTrace();
}
```



### 消息持久化与消息确认机制

>  问题：为什么要消息持久化？
>
>  MQ接收到消息后，Binding可以本地持久化消息，这样可以避免因为服务器宕机导致的消息丢失。
>
>  问题：为什么需要消息确认？
>
>  因为我们无法保证消息发布者在将消息发布出去后，消息能够正确到达消息队列里。消息确认的最主要的目的就是为了确保消息要100%传递到MQ中，避免消息在到达MQ的阶段已经丢失。

如何确保消息100%投递成功？

- 保障消息的成功发出

- 保障MQ节点的成功接收
- 发送端收到MQ节点（Broker）确认应答
- 完善的消息进行补偿机制

因为前3步分别从生产者、消息队列、消费者3个环节进行确认，但是都不能100%保证消息投递成功，因此需要加上第4步。

一般的补偿机制方案如下：

方案1：`消息落库`

![image-20190930114011178](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020217.png)

在互联网大厂，一般都会采用`消息落库`的方案，来进行消息补偿，避免消息丢失。

- 消息状态分为3种，`未发送`、`已发送`、`已送达`。发送消息的同时，将消息持久化到数据库中，并且给消息设置好状态`已发送`。当消息状态发生变化的时候，将数据库中的消息状态同步变更。

- 对于已发送未到达的消息，会定时去做轮询操作，调用生产者重新发送。但是重新发送的次数也需要做个限制，保持在3-5次。

这个方案主要缺点有2个：

- 性能瓶颈：消息落库、以及消息状态变更都会落库，会造成数据库压力过大；

- 事物一致性：发送消息、消息落库2个动作需要有事物机制保护，这点也会造成性能下降；

  

方案2： 延迟确认

![image-20190930121108552](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-20215.png)

- 第一步，生产者发送消息到消息队列
- 第二步，消息队列监听消费者消息确认
- 第三步，消费者发送消息确认信息
- 第四步，callback监听mq的消息确认
- 第五步，更新消息状态，确定消息发送成功；
- ==在第一步中，生产者发送消息后，可以设置延迟2-5分钟，再次发送消息，确认上次发送的消息否已经送达==
- ==callback会去监听mq的这个确认消息，并对需要确认的消息进行检查；==
- ==如果消息已经发送成功，不做处理；如果消息没有成功，会远程调用生产者服务再次发送消息==；



### 消息Return机制

> 消息重回机制是为了对没有处理成功的消息，把消息重新传递给MQ Broker。
>
> Return Listener就是用来实现这一机制的；

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2019-10-01-090144.png" width="400"/>

当生产者将消息发送到消息队列时，MQ找不到任何匹配的消息Exchange，或者匹配到了Exchange却无法找到对应`Routing-Key`的消费队列Queue。

那么MQ无法处理这些消息，所以需要还给生产者重新处理这些消息（比如重新发送）；

因此MQ Broker提供了这种Return机制，通过设置Return Listener来去处理这些不可送达的消息。

```java
// Producer.java
Connection connection = connectionFactory.newConnection();
Channel channel = connection.createChannel();
String exchange = "return_true_exchange";
String routingKey = "all";
String routingKeyError = "all-error";
channel.exchangeDeclare(exchange, BuiltinExchangeType.DIRECT);
channel.addReturnListener((int replyCode, String replyText, String exchange1, String routingKey1, AMQP.BasicProperties properties, byte[] body) -> {
  String txt = new String(body, "UTF-8");
  System.out.format("消息被返回%s, exhcange: %s, routingKey: %s\n",txt, exchange1, routingKey1);
});
// 当routingKey匹配不上的时候，mq会通过ReturnListener来自动返回消息；
if (isReturn) {
  channel.basicPublish(exchange, routingKeyError, true, null, message.getBytes());
} else {
  channel.basicPublish(exchange, routingKey, true, null, message.getBytes());
}
```



### 消息事物

事务主要是保证消息要发送到Broker当中。

- amqp协议自带支持的事物

  > - txSelect() 将当前channel设置成transaction模式
  > - txCommit() 提交事务
  > - txRollback() 回滚事务

  ```java
  // Producer.java
  connection = connectionFactory.newConnection();
  channel = connection.createChannel();
  // 声明交换机
  channel.queueDeclare(QUEUE_NAME, false, false, false, null);
  channel.txSelect();
  String message = "this result is: ";
  channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
  double count = dividend / divisor;
  channel.basicPublish("", QUEUE_NAME, null, String.valueOf(count).getBytes());
  channel.txCommit();
  System.out.println(" [x] Sent '" + message + "'");
  ```

  

- confirm模式

  - 串行确认模式

    ```java
    // Producer.java
    // 单个确认
    connection = connectionFactory.newConnection();
    channel = connection.createChannel();
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    channel.confirmSelect();
    long start = System.nanoTime();
    for (int i = 0; i < MESSAGE_COUNT; i++) {
      String body = String.valueOf(i);
      channel.basicPublish("", QUEUE_NAME, null, body.getBytes());
      channel.waitForConfirmsOrDie(5_000);
    }
    long end = System.nanoTime();
    
    =============
      // 批量确认
    connection = connectionFactory.newConnection();
    channel = connection.createChannel();
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    channel.confirmSelect();
    connection = connectionFactory.newConnection();
    for (int i = 0; i < MESSAGE_COUNT; i++) {
      String body = String.valueOf(i);
      channel.basicPublish("", QUEUE_NAME, null, body.getBytes());
    }
    channel.waitForConfirmsOrDie(5_000);
    long end = System.nanoTime();
    ```

    

  - 异步确认模式

    ```java
    connection = connectionFactory.newConnection();
    channel = connection.createChannel();
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    // 开启确认模式
    channel.confirmSelect();
    ConcurrentNavigableMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();
    // 成功的处理
    ConfirmCallback cleanOutstandingConfirms = (sequenceNumber, multiple) -> {
      if (multiple) {
        ConcurrentNavigableMap<Long, String> confirmed = outstandingConfirms.headMap(sequenceNumber, true);
        confirmed.clear();
      } else {
        outstandingConfirms.remove(sequenceNumber);
      }
      System.out.println("消息发送成功：" + sequenceNumber);
    };
    // 添加确认监听器listener
    channel.addConfirmListener(cleanOutstandingConfirms, (sequenceNumber, multiple) -> {
      // 失败的处理
      String body = outstandingConfirms.get(sequenceNumber);
      System.err.format(
        "Message with body %s has been nack-ed. Sequence number: %d, multiple: %b%n",
        body, sequenceNumber, multiple
      );
      // 失败了，交给cleanOutstandingConfirms再次处理
      cleanOutstandingConfirms.handle(sequenceNumber, multiple);
    });
    long start = System.nanoTime();
    for (int i = 0; i < MESSAGE_COUNT; i++) {
      String body = String.valueOf(i);
      outstandingConfirms.put(channel.getNextPublishSeqNo(), body);
      channel.basicPublish("", QUEUE_NAME, null, body.getBytes());
    }
    long end = System.nanoTime();
    System.out.format("Published %,d messages and handled confirms asynchronously in %,d ms%n", MESSAGE_COUNT, Duration.ofNanos(end - start).toMillis());
    ```



> 不同模式的运行效果：
>
> Published 50,000 messages individually in 13,080 ms
>
> Published 50,000 messages in batch in 2,935 ms
>
> Published 50,000 messages and handled confirms asynchronously in 3,446 ms
>
> 可以看出来，单个运行的效率比较慢，批量确认以及异步确认的模式效率较高；





### 集成Spring

> https://gitee.com/dendi.ke/thread-demo/blob/master/pom.xml

相关依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

Spring配置文件

```properties
#rabbitmq
spring.rabbitmq.username=user
spring.rabbitmq.password=Abc123123
spring.rabbitmq.addresses=127.0.0.1
spring.rabbitmq.port=5672
spring.rabbitmq.publisher-confirms=true
spring.rabbitmq.virtual-host=/
```

MqConfig.java

可以单独声明一个类，作为mq的配置类。这个类里面可以定义比如MqFactory、RabbitAdmin等工厂类。

```java
/**
 * @Author: Coda
 * @Create Date: 2019-09-29 14:35
 * @Update Date: 2019-09-29 14:35
 */
@Configuration
public class RabbitMqConfig {

	@Value("${spring.rabbitmq.addresses}")
	private String host;

	@Value("${spring.rabbitmq.port}")
	private int port;

	@Value("${spring.rabbitmq.username}")
	private String username;

	@Value("${spring.rabbitmq.password}")
	private String password;

	@Value("${spring.rabbitmq.virtual-host}")
	private String virtualHost;

	@Value("${spring.rabbitmq.publisher-confirms}")
	private boolean publisherConfirms;

	@Bean
	public ConnectionFactory connectionFactory() {
		CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory();
		cachingConnectionFactory.setHost(host);
		cachingConnectionFactory.setPort(port);
		cachingConnectionFactory.setUsername(username);
		cachingConnectionFactory.setPassword(password);
		cachingConnectionFactory.setVirtualHost(virtualHost);
		cachingConnectionFactory.setPublisherConfirms(publisherConfirms);
		cachingConnectionFactory.setPublisherReturns(true);
		return cachingConnectionFactory;
	}

	@Bean
	public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
		RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory);
		rabbitAdmin.setAutoStartup(true);
		return rabbitAdmin;
	}


	@Bean
	@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
	public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
		RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
		return rabbitTemplate;
	}
}
```





#### RabbitAdmin

> RabbitAdmin类可以很好的支持RabbitMQ, 在Spring中直接进行注入即可
>
> - autoStartUp必须要设置为true,否则Spring容器不会加载RabbitAdmin类
> - RabbitAdmin底层实现就是从Spring容器中获取Exchange、Bingding、RoutingKey以及Queue的@Bean声明

RabbitAdmin的使用：通过@Autowired导入到类里，然后利用rabbitAdmin来定义队列

```java
//直连监听
rabbitAdmin.declareExchange(new DirectExchange("test.direct", false, false));

rabbitAdmin.declareExchange(new TopicExchange("test.topic", false, false));

rabbitAdmin.declareExchange(new FanoutExchange("test.fanout", false, false));

rabbitAdmin.declareQueue(new Queue("test.direct.queue", false));

rabbitAdmin.declareQueue(new Queue("test.topic.queue", false));

rabbitAdmin.declareQueue(new Queue("test.fanout.queue", false));

//第一个参数：具体的队列 第二个参数：绑定的类型 第三个参数：交换机 第四个参数：路由key 第五个参数：arguments 参数
rabbitAdmin.declareBinding(new Binding("test.direct.queue",
                                       Binding.DestinationType.QUEUE,
                                       "test.direct", "direct", new HashMap<>()));

//BindingBuilder 链式编程
rabbitAdmin.declareBinding(
  BindingBuilder
                .bind(new Queue("test.topic.queue", false))     //直接创建队列
                .to(new TopicExchange("test.topic", false, false))  //直接创建交换机 建立关联关系
                .with("user.#"));   //指定路由Key


rabbitAdmin.declareBinding(
          BindingBuilder
                .bind(new Queue("test.fanout.queue", false))        
          .to(new FanoutExchange("test.fanout", false, false)));

//清空队列数据
rabbitAdmin.purgeQueue("test.topic.queue", false);
```



#### 声明消息队列



#### RabbitTemplate

> 消息模板
>
> 该类提供了丰富的发送消息方法，包括可靠性投递消息方法、回调监听消息接口ConfirmCallback、返回值确认接口ReturnCallback等等。同样我们需要进行注入到Spring容器中，然后直接使用。



#### SimpleMessageListenerContainer

**简单消息监听容器**

- 监听队列(多个队列)、自动启动、自动声明功能
- 设置事务特性、事务管理器、事务属性、事务容器(并发)、是否开启事务、回滚消息等
- 设置消费者数量、最小最大数量、批量消费
- 设置消息确认和自动确认模式、是否重回队列、异常捕捉handler函数
- 设置消费者标签生成策略、是否独占模式、消费者属性等
- 设置具体的监听器、消息转换器等等。

```java
@Bean
	public SimpleMessageListenerContainer messageListenerContainer(ConnectionFactory connectionFactory) {
		SimpleMessageListenerContainer container = new SimpleMessageListenerContainer(connectionFactory);
		container.setQueues(queue1());
		container.setConcurrentConsumers(1);
		container.setMaxConcurrentConsumers(5);
		container.setDefaultRequeueRejected(false);
		container.setAcknowledgeMode(AcknowledgeMode.AUTO);
		container.setExposeListenerChannel(true);
		container.setConsumerTagStrategy(queue ->  queue + "_" + UUID.randomUUID().toString());
    // 设置具体的监听器
		container.setMessageListener(message -> {
				String msg = new String(message.getBody());
				System.err.println("----------消费者: " + msg);
		});
}
```



#### MessageListenerAdapter 消息监听适配器

**默认handleMessage**

```java
// 同样在SimpleMessageListenerContainer 这个方法里
MessageListenerAdapter adapter = new MessageListenerAdapter(new MessageDelegate());
container.setMessageListener(adapter);

// MessageDelegate类
public class MessageDelegate {
    public void handleMessage(byte[] messageBody) {
        System.err.println("默认方法, 消息内容:" + new String(messageBody));
    }
}
```

MessageDelegate类中，方法名与参数`handleMessage(byte[] messageBody)`是固定的。为什么呢？

**MessageListenerAdapter源码分析**

我们来看下MessageListenerAdapter底层代码

![image-20190929181504955](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020214.png)默认方法名就是叫handleMessage，当然也可以自己去指定设置

**自定义方法名**

```java
MessageListenerAdapter adapter = new MessageListenerAdapter(new MessageDelegate());
adapter.setDefaultListenerMethod("consumeMessage");
container.setMessageListener(adapter);

//对应也要修改MessageDelegate类
public class MessageDelegate {
    public void consumeMessage(byte[] messageBody) {
        System.err.println("字节数组方法, 消息内容:" + new String(messageBody));
    }
}
```



#### MessageConverter消息转换器

我们在进行发送消息的时候，正常情况下消息体为二进制的数据方式进行传输。对应的adapter的方法入参也是二进制数组。如果希望进行转换，指定自定义的转换器，就需要用到MessageConverter

- 自定义常用转换器：MessageConverter，一般来讲都需要实现这个接口
- 重写下面两个方法：
  `toMessage`: java对象转换为Message
  `fromMessage`: Message对象转换为java对象
- Json转换器：Jackson2JsonMessageConverter:可以进行Java对象的转换功能
- DefaultJackson2JavaTypeMapper映射器：可以进行java对象的映射关系
- 自定义二进制转换器：比如图片类型、PDF、PPT、流媒体

```java
// 文字转化器
public class TextMessageConverter implements MessageConverter {

    @Override
    public Message toMessage(Object object, MessageProperties messageProperties) throws MessageConversionException {
        return new Message(object.toString().getBytes(), messageProperties);
    }

    @Override
    public Object fromMessage(Message message) throws MessageConversionException {
        String contentType = message.getMessageProperties().getContentType();
        if(null != contentType && contentType.contains("text")) {
            return new String(message.getBody());
        }
        return message.getBody();
    }

}
```



### 消息的幂等性

> 幂等（idempotent、idempotence）是一个数学与计算机学概念，常见于抽象代数中，即f(f(x)) = f(x)。简单的来说就是**一个操作多次执行产生的结果与一次执行产生的结果一致**。

**冥等性的作用**：

在高并发的情况下，会有大量的消息到达MQ，消费端会接受到大量的消息。这样的情况下，难免会出现消息的重复投递，网络异常等情况。如果不去做幂等处理，很有可能会出现消息的**重复消费**。

**幂等性的方案**：

- 唯一ID+指纹码机制，利用数据库主键去重
- 利用Redis的原子性实现



### TTL 生存时间

- TTL是Time To Live的缩写，也就是生存时间
- RabbitMQ支持消息的过期时间，在消息发送时可以进行指定生存时间；从消息进入队列开始计算，只要超过了队列的时间配置，消息会自动删除；



```java
// TTL Demo
String exchangName = "demo_ttl_exchange";
String queueName = "demo_ttl_queue";
// 删除队列
rabbitAdmin.deleteQueue(queueName);
// 删除Exchange
rabbitAdmin.deleteExchange(exchangName);
Map<String, Object> arguments = new HashMap<>();
arguments.put("x-message-ttl", 10000);
arguments.put("x-max-length", 1);
Queue queue = new Queue(queueName, true, false, false, arguments);
rabbitAdmin.declareExchange(new TopicExchange(exchangName));
rabbitAdmin.declareQueue(queue);
rabbitAdmin.declareBinding(new Binding(queueName, Binding.DestinationType.QUEUE, exchangName, "ttl.#", null));
org.springframework.amqp.core.MessageProperties messageProperties = new org.springframework.amqp.core.MessageProperties();
Message messageObj = new Message(message.getBytes(), messageProperties);
rabbitTemplate.convertAndSend(exchangName, "ttl.message", messageObj);

```





### 死信队列 DLX

>当消息被拒收(basic.reject / basic.nack) 并且requeue = false时
>
>或者当消息TTL到期
>
>或者当消息队列达到最大的长度
>
>这些消息能够重新发送到一个Exchange里，这个Exchange就是DLX

**Demo**

声明一个死信队列和RoutingKey

> Exchange: dlx.exchange; (Exchange名称随意)；
>
> RoutingKey: dlx (RoutingKey名称随意，只需要和队列能接受到即可)

正常声明 Exchange、Queue、RoutingKey，并且设置Queue参数：("x-dead-letter-exchange","dlx.exchange");

这样消息在TTL过期、或者当队列达到最大长度时，消息就可以直接路由到死信队列！

![image-20191003163250278](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020212.png)

![image-20191003163316561](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-01-16-020213.png)

```java
// RabbitMqConfig.java
@Bean
public Exchange dlxExchange() {
  return new DirectExchange(DEAD_EXCHANGE_NAME);
}

@Bean
public Queue dlxQueue() {
  Queue queue = new Queue(QUEUE_NAME);
  return queue;
}

@Bean
public Binding bindDlxQueue(Queue dlxQueue, Exchange dlxExchange) {
  return BindingBuilder.bind(dlxQueue).to(dlxExchange).with("dlx").noargs();
}

// Producer.java
String exchangeName = "test_dlx_exchange";
String queueName = "test_dlx_queue";
String routingKey = "demo_dlx";
String message = "Hello RabbitMQ DLX Message";
Map<String, Object> args = new HashMap<>(2);
args.put("x-dead-letter-exchange", "dlx_exchange");
args.put("x-dead-letter-routing-key", "dlx");
rabbitAdmin.declareQueue(new Queue(queueName, true, false, false, args));
rabbitAdmin.declareExchange(new TopicExchange(exchangeName));
rabbitAdmin.declareBinding(new Binding(queueName, Binding.DestinationType.QUEUE, exchangeName, routingKey, null));
for(int i = 0; i< 1; i ++){
  MessageProperties messageProperties = new MessageProperties();
  messageProperties.setDeliveryMode(MessageProperties.DEFAULT_DELIVERY_MODE);
  messageProperties.setExpiration("10000");
  Message msg = new Message((message + i).getBytes(), messageProperties);
  rabbitTemplate.convertAndSend(exchangeName, routingKey, msg);
}
```

注：`test_dlx_queue`声明了参数，设置了死信exchange为`dlx_exchange`

当`test_dlx_queue`消息变成死信时，消息会自动转向`dlx_exchange` -> `dlx_queue`;

