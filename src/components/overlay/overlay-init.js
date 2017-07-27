import { getZIndex } from '../utils/get-zindex.js'
import Vue from 'vue'
import overlayOpt from './overlay.vue'
const Overlay = Vue.extend(overlayOpt)

const OverlayShow = {
	instances: [],
	overlay: false,
	open(instance) {
		//检测实例是否存在，或者实例是否已经生成
		if (!instance || this.instances.indexOf(instance) !== -1) return;
		if (this.instances.length === 0) {
			this.showOverlay(instance.overlayColor, instance.overlayOpacity, instance);
		}
		this.instances.push(instance);
		this.changeOverlayStyle();
		instance.$el.style.zIndex = getZIndex();
	},
	close(instance) {
		let index = this.instances.indexOf(instance);

		if (index === -1) return;

		Vue.nextTick(() => {
			this.instances.splice(index, 1);
			if (this.instances.length === 0) {
				this.closeOverlay();
			}
			this.changeOverlayStyle();
		})
	},
	showOverlay(color, opacity, instance) {
		let overlay = this.overlay = new Overlay({
			el: document.createElement('div')
		});

		overlay.color = color;
		overlay.opacity = opacity;
		overlay.onClick = this.handlerOverlayClick.bind(this);

		instance.$el.parentNode.insertBefore(overlay.$el, instance.$el);

		this.bodyStyle = {
			overflow: document.body.style.overflow,
			width: document.body.style.width,
			height: document.body.style.height,
			position: document.body.style.position
		};
		document.body.style.position = "fixed";
		document.body.style.width = "100%";
		document.body.style.height = "100%";
		document.body.style.overflow = 'hidden';
	},
	closeOverlay() {
		if (!this.overlay) return;
		document.body.style.position = this.bodyStyle.position;
		document.body.style.width = this.bodyStyle.width;
		document.body.style.height = this.bodyStyle.height;
		document.body.style.overflow = this.bodyStyle.overflow;
		let overlay = this.overlay;
		this.overlay = null;
		overlay.$el.remove(() => {
			overlay.$destroy();
		})
	},
	changeOverlayStyle() {
		if (!this.overlay || this.instances.length === 0) return;
		const instance = this.instances[this.instances.length - 1];
		this.overlay.color = instance.overlayColor;
		this.overlay.opacity = instance.overlayOpacity;
	},
	handlerOverlayClick() {
		if (this.instances.length === 0) return;
		const instance = this.instances[this.instances.length - 1];
		if (instance.overlayClick) {
			instance.overlayClick();
		}
	}
}

export default OverlayShow
