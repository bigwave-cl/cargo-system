//遮罩层
import overlay from './overlay/overlay.vue'

//日历控件
import calendarPicker from './calendar-picker/calendar-picker';
//小时时间选择控件
import timePicker from './time-picker/time-picker';

//modal控件
import modal from './modal/modal';
import confirm from './modal/confirm';
import loading from './modal/loading';

//按钮控件
import askButton from './ask-button/ask-button';

//toast弹框提示控件
import askToast from './ask-toast/ask-toast';

//prompt输入控件
//TODO 封装到modal中
import askPrompt from './ask-prompt/ask-prompt';

//左侧滑动框
import slideNav from './slide-nav';

var components = {
	overlay,
	'calendar-picker': calendarPicker,
	'time-picker': timePicker,
	modal,
	confirm,
	loading,
	'ask-button':askButton,
	'ask-toast':askToast,
	'ask-prompt':askPrompt,
	'slide-nav':slideNav
}

export default {
	install(Vue) {
		Object.keys(components).forEach((key) => Vue.component(key, components[key]));
	}
}
