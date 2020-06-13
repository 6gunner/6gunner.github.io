# 笔记备忘

cctx库开发文档

https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md



cctx库调用

https://github.com/ccxt/ccxt/wiki

```
 User
    +-------------------------------------------------------------+
    |                            CCXT                             |
    +------------------------------+------------------------------+
    |            Public            |           Private            |
    +=============================================================+
    │                              .                              |
    │                    The Unified CCXT API                     |
    │                              .                              |
    |       loadMarkets            .           fetchBalance       |
    |       fetchMarkets           .            createOrder       |
    |       fetchCurrencies        .            cancelOrder       |
    |       fetchTicker            .             fetchOrder       |
    |       fetchTickers           .            fetchOrders       |
    |       fetchOrderBook         .        fetchOpenOrders       |
    |       fetchOHLCV             .      fetchClosedOrders       |
    |       fetchStatus            .          fetchMyTrades       |
    |       fetchTrades            .                deposit       |
    |                              .               withdraw       |
    │                              .                              |
    +=============================================================+
    │                              .                              |
    |                     Custom Exchange API                     |
    |         (Derived Classes And Their Implicit Methods)        |
    │                              .                              |
    |       publicGet...           .          privateGet...       |
    |       publicPost...          .         privatePost...       |
    |                              .          privatePut...       |
    |                              .       privateDelete...       |
    |                              .                   sign       |
    │                              .                              |
    +=============================================================+
    │                              .                              |
    |                      Base Exchange Class                    |
    │                              .                              |
    +=============================================================+
```

接口分为2类，一类是`统一接口`，一类是`交易所自定义接口`。



## 统一接口

- `fetchMarkets ()`: Fetches a list of all available markets from an exchange and returns an array of markets (objects with properties such as `symbol`, `base`, `quote` etc.). Some exchanges do not have means for obtaining a list of markets via their online API. For those, the list of markets is hardcoded.
- `fetchCurrencies ()`: Fetches all available currencies an exchange and returns an associative dictionary of currencies (objects with properties such as `code`, `name`, etc.). Some exchanges do not have means for obtaining currencies via their online API. For those, the currencies will be extracted from market pairs or hardcoded.
- `loadMarkets ([reload])`: Returns the list of markets as an object indexed by symbol and caches it with the exchange instance. Returns cached markets if loaded already, unless the `reload = true` flag is forced.
- `fetchOrderBook (symbol[, limit = undefined[, params = {}]])`: Fetch L2/L3 order book for a particular market trading symbol.
- `fetchStatus ([, params = {}])`: Returns information regarding the exchange status from either the info hardcoded in the exchange instance or the API, if available.
- `fetchL2OrderBook (symbol[, limit = undefined[, params]])`: Level 2 (price-aggregated) order book for a particular symbol.
- `fetchTrades (symbol[, since[, [limit, [params]]]])`: Fetch recent trades for a particular trading symbol.
- `fetchTicker (symbol)`: Fetch latest ticker data by trading symbol.
- `fetchBalance ()`: Fetch Balance.
- `createOrder (symbol, type, side, amount[, price[, params]])`
- `createLimitBuyOrder (symbol, amount, price[, params])`
- `createLimitSellOrder (symbol, amount, price[, params])`
- `createMarketBuyOrder (symbol, amount[, params])`
- `createMarketSellOrder (symbol, amount[, params])`
- `cancelOrder (id[, symbol[, params]])`
- `fetchOrder (id[, symbol[, params]])`
- `fetchOrders ([symbol[, since[, limit[, params]]]])`
- `fetchOpenOrders ([symbol[, since, limit, params]]]])`
- `fetchClosedOrders ([symbol[, since[, limit[, params]]]])`
- `fetchMyTrades ([symbol[, since[, limit[, params]]]])`



## 交易所自定义接口

所有请求都是通过 index.js里的反射进行调用的

所以接口路径需要根据路径进行拼接：

```js
'api': {
  'public': {
    'get': ['ping', 'time', 'brokerInfo', // 查询当前broker交易规则和symbol信息
    'getOptions', ],
  },
  'quote': {
    'get': ['depth', // 获取深度
    'depth/merged', 'trades', // 获取当前最新成交
    'klines', // 获取K线数据
    'ticker/24hr', // 获取24小时价格变化数据
    'ticker/price', 'ticker/bookTicker', 'contract/index', // 获取合约标的指数价格
    'contract/depth', // 获取合约深度
    'contract/depth/merged', 'contract/trades', // 获取合约最近成交,
    'contract/klines', // 获取合约的K线数据
    'contract/ticker/24hr', 'option/index', 'option/depth', 'option/depth/merged', 'option/trades', 'option/klines', 'option/ticker/24hr', ],
  },
  'contract': {
    'get': [
    // public
    'insurance', 'fundingRate', // 获取资金费率信息
    // private
    'openOrders', // 查询合约当前委托
    'historyOrders', // 查询合约历史委托
    'getOrder', // 查询合约订单详情
    'myTrades', // 查询合约历史成交
    'positions', // 查询合约当前持仓
    'account', // 查询合约账户信息
    ],
    'post': ['order', // 创建合约订单
    'modifyMargin', // 修改保证金
    ],
    'delete': ['order/cancel', // 取消合约订单
    'order/batchCancel', ],
  },
  'option': {
    'get': ['openOrders', 'positions', 'historyOrders', 'getOrder', 'myTrades', 'settlements', 'account', ],
    'post': ['order', ],
    'delete': ['order/cancel', ],
  },
  'private': {
    'get': ['order', // 查询订单
    'openOrders', // 查询当前委托
    'historyOrders', // 查询历史委托
    'account', // 获取当前账户信息
    'myTrades', // 查询历史成交
    'depositOrders', 'withdrawalOrders', 'withdraw/detail', 'balance_flow', ],
    'post': ['order', // 创建新订单
    'order/test', 'userDataStream', 'subAccount/query', 'transfer', 'user/transfer', 'withdraw', ],
    'put': ['userDataStream', ],
    'delete': ['order', // 取消订单
    'userDataStream', ],
  },
}
```

私有的接口访问：`exchange.privateGetOrder`, `exchange.privateOpenOrders`

public的接口访问： `exchange.quoteGetDepth`，`exchange.quoteGetTicker24hr`



# 上次问题

## 1.有没有可能priceMin = 0 ?

![image-20200416203741136](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-16-134731.png)





## 2.limit没处理

### ![企业微信截图_c57e06fa-0baa-41a0-878c-0f326c11323e](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-16-134729.png)





## 3.下单后，时间戳为undefined

![image-20200416210526416](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-16-134733.png)

![image-20200416211206945](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-16-134734.png)



## 4.查询订单信息为空

![image-20200416211657129](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-16-134730.png)

![企业微信截图_90f96f83-4fb5-4c0b-9cda-520986db98c9](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-04-16-134732.png)



# 2020.5.7日测试问题

## 5.创建计划委托失败



## 6.文档错误

![image-20200507163509249](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-05-07-083509.png)





## 7.减少保证金接口错误



## 8.没有getOrder接口

<img src="https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-05-07-121630.png" alt="image-20200507201629997" style="zoom:50%;" />



## 9. option/index参数名错误

![image-20200507221744211](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-05-07-141744.png)



## 10 获取期权账户接口返回字段少

期望：![image-20200507222915810](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-05-07-142916.png)

实际：

![image-20200507222931480](https://ipic-coda.oss-cn-beijing.aliyuncs.com/2020-05-07-142931.png)