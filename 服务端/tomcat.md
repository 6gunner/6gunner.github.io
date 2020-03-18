## 设置tomcat不生成catalina.out

`方案1`: 找到tomcat目录conf，logging.properties把这个文件重命名（推荐），其实删掉也可以但是不建义

​    这样就不会生成host-manager.log、localhost.log、manager.log、catalina.log这些文件

   注:把 conf/loging.properties 中的等级全都等于OFF 也不行,我试过



`方案2`: 

```sh
if [ -z "$CATALINA_OUT" ] ; then
  #CATALINA_OUT="$CATALINA_HOME"/logs/catalina.out
  CATALINA_OUT=/dev/null
fi
```

