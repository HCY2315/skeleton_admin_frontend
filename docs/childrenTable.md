###  ChildrenTable  通用子表组件
>  该组件主要用于被主表嵌套使用

### 可能使用的业务场景
- 1.主表一条数据，挂载了子表的多条数据，这样的模式就可以在一个界面编辑，在业务逻辑关系上思路非常紧凑.
- 2.如下的一个主表和子表同时操作的示例界面.

![主表子表示例图](https://www.ginskeleton.com/images/users_sub.png)

### 使用指南
>	[相关代码详情](../src/components/system-setting/system-menu/create_edit.vue)
```code

	// 1.引用组件
	import ChildrenTable from '_c/system-setting/common/children_table'
   // 导入
	export default {
  name: 'createEdit',
  components: {
    ChildrenTable
  }
  	//... 省略其他无关代码
  }

    // 界面引用
    <ChildrenTable :formInfo="formInfo"></ChildrenTable>

	// 2.定义子表的各项属性
	 formInfo: {
        //子表一条数据所拥有的字段定义
        formDataItem: {
          id:0,
          fr_auth_system_menu_id:0,
          fr_auth_button_cn_en_id:0,
          fk_element_status:0,
          button_name:'',
          request_url:'/',
          request_method:"",
          remark:''
        },
        //子表字段定义： 目前每种字段数据类型可选项有5种——dialog（公共组件对话框）、text（文本）、select（列表）、upload（文件上传）
        tableCols:[
          {
            name:'按钮名称',//表单名称
            type : "dialog",//类型{弹出框}
            field:'button_name',//字段名
            componentPath : '_c/system-setting/common/button_cn_en',
            width:'6',//宽度,参考iview的col  row  ,一行值共计24
            modalWidth:'700px', // 弹出框宽度
            //字段与弹出框组件字段的映射
            map:{
              fr_auth_button_cn_en_id:'id',
              button_name:'cn_name',
              request_method:'allow_method'
            }
          },
          {
            name:'接口地址',
            type : "string",
            field:'request_url',
            width:'5',
            isShow:false,  // 是否显示该列，true 显示; false 隐藏, 如果不写此字段，默认为 true（显示）
            disabled:false  // 该列是否只读，true 只读; false  可编辑, 如果不写此字段，默认为 false（可编辑）
          },
          {
            name:'请求方式',
            // selectString 类型表示选中的文本和实际值是一样的
            type : "selectString",
            field:'request_method',
            width:'4',
            option:[
              '*',
              'GET',
              'POST'
            ]
          },
          {
            name: '元素状态',
            // selectNumber 类型表示选中的文本会映射成实际的数字型
            type: "selectNumber",
            field: 'fk_element_status',
            width: '6',
            option: {
              1: '正常',
              2: '禁止',
              3: '隐藏'
            }
          },
          // 数字类型, 包括整数型、小数型
           {
             name:'数字',
             type : "number",
             field:'aa',
             width:'5',
           },
         {
           name:'文件上传',
           type : "upload",
           field:'file_path',
           width:'3',
         },
        ],

        //获取子表结果集数据，数组类型，如果给该参数设置值，就会代替默认填充值对子表进行填充
        resultArr:[],

        //修改时,如果子表涉及到删除,则删除的ids在这里记录,具体格式：1,2,3
        deleteString:'',

        //新增时给子表设置默认值
        defaultCreate : [
        {
          id:0,
          fr_auth_system_menu_id:0,
          fr_auth_button_cn_en_id:1,
          button_name:'新增',
          request_url:'/',
          request_method:"POST",
          fk_element_status:1,
          remark:''
        },
        {
          id:0,
          fr_auth_system_menu_id:0,
          fr_auth_button_cn_en_id:2,
          button_name:'删除',
          request_url:'/',
          request_method:"POST",
          fk_element_status:1,
          remark:''
        },
        {
          id:0,
          fr_auth_system_menu_id:0,
          fr_auth_button_cn_en_id:3,
          button_name:'修改',
          request_url:'/',
          request_method:"POST",
          fk_element_status:1,
          remark:''
        },
        {
          id:0,
          fr_auth_system_menu_id:0,
          fr_auth_button_cn_en_id:4,
          button_name:'查询',
          request_url:'/',
          request_method:"GET",
          fk_element_status:1,
          remark:''
        },
      ],
    }
```

###  最终的数据提交格式

```code
# 主表数据
{
  "fid":2,
  "ftitle":"系统配置",
  "name":"user",
  "path":"user",
  "component":"view/system-setting/users/index",
  "id":6,
  "title":"用户管理",
  "status":1,
  "sort":896,
  "button_delete":"",
  "remark":"",
  "icon":"md-person",

# 子表数据
"button_array":[

  {"id":1,"fr_auth_system_menu_id":6,"fr_auth_button_cn_en_id":1,"button_name":"新增","request_method":"POST","request_url":"/admin/users/create","status":1,"remark":"6=用户管理菜单|增"},
  {"id":2,"fr_auth_system_menu_id":6,"fr_auth_button_cn_en_id":2,"button_name":"删除","request_method":"POST","request_url":"/admin/users/destroy","status":1,"remark":"删"},
  {"id":3,"fr_auth_system_menu_id":6,"fr_auth_button_cn_en_id":3,"button_name":"修改","request_method":"POST","request_url":"/admin/users/edit","status":1,"remark":"改"},
  {"id":4,"fr_auth_system_menu_id":6,"fr_auth_button_cn_en_id":4,"button_name":"查询","request_method":"GET","request_url":"/admin/users/list*","status":1,"remark":"查"}

]

}


```

![主表子表提交数据](https://www.ginskeleton.com/images/user_sub_data.png)

