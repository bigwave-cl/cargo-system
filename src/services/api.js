import { domain } from '../config.js';
const localApi = {
	"home_customer":"../../static/home_customer.json",//首页获取客户信息
    "client_order": "../../static/client_order.json", //配送单地图订单数据接口
    "client_delivery_order": "../../static/client_delivery_order.json", //配送单列表数据接口
    "client_delivery_order_del": "../../static/client_delivery_order_del.json", //配送单列表数据删除接口
    "client_delivery_order_detail": "../../static/client_delivery_order_detail.json", //配送单详情数据接口
    "client_driver": "../../static/client_driver.json", //配送单新增和编辑页面司机数据接口
    "client_add_order": "../../static/client_add_order.json", //配送单新增页面地图订单数据接口
    "client_edit_order": "../../static/client_add_order.json", //配送单编辑页面地图订单数据接口
    "get_location": domain+"/get-location", //获取中心位置
    "client_edit": domain+"/deliver-info", //编辑配送单的初始数据
    "client_save": domain+"/add-deliver", //编辑和新增配送单的保存接口
}

export const API = localApi;
