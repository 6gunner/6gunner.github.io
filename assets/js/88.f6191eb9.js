(window.webpackJsonp=window.webpackJsonp||[]).push([[88],{445:function(t,e,s){"use strict";s.r(e);var a=s(25),n=Object(a.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("这一章核心思路是：利用 Map 和 Set 处理，可能会用到排序、hash表、二分查找等技术。")]),t._v(" "),s("h3",{attrs:{id:""}},[s("a",{staticClass:"header-anchor",attrs:{href:"#"}},[t._v("#")])]),t._v(" "),s("h3",{attrs:{id:"两个数组的交集-ii-350"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#两个数组的交集-ii-350"}},[t._v("#")]),t._v(" 两个数组的交集 II-350")]),t._v(" "),s("p",[t._v("链接："),s("a",{attrs:{href:"https://leetcode-cn.com/problems/intersection-of-two-arrays-ii",target:"_blank",rel:"noopener noreferrer"}},[t._v("leetcode-cn.com/problems/in…"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("给定两个数组，编写一个函数来计算它们的交集。")]),t._v(" "),s("p",[s("strong",[t._v("思路：")])]),t._v(" "),s("p",[t._v("​\t遍历数组A，将元素 - 出现的次数 映射成一个hashmap。")]),t._v(" "),s("p",[t._v("​\t然后遍历数组B，去hashmap里去找，如果hashmap里存在改key，==将hashmap的值 - 1 （主要是考虑重复的情况）==，然后将数放入到答案里。")]),t._v(" "),s("p",[t._v("这个 - 1 很灵性，我之前只想到存两个hashmap，然后再遍历。")]),t._v(" "),s("p",[s("strong",[t._v("进阶：")])]),t._v(" "),s("p",[s("em",[t._v("如果给定的数组已经排好序呢？你将如何优化你的算法？")])]),t._v(" "),s("p",[t._v("同时遍历 A，B 数组，如果两个数字不相等，则将指向较小数字的指针右移一位，如果两个数字相等，将该数字添加到答案，并将两个指针都右移一位。")]),t._v(" "),s("p",[t._v("直到有一个指针超出了数组。")]),t._v(" "),s("p",[s("em",[t._v("如果 nums1 的大小比 nums2 小很多，哪种方法更优？")])]),t._v(" "),s("p",[t._v("先遍历nums1，再遍历nums2。")]),t._v(" "),s("p",[s("em",[t._v("如果 nums2 的元素存储在磁盘上，磁盘内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？")])]),t._v(" "),s("p",[t._v("nums1的元素数量比较少，所以可以先加载到内存里。然后去读取nums2的数据，来放入")])])}),[],!1,null,null,null);e.default=n.exports}}]);