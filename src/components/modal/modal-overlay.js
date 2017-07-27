import OverlayShow from '../overlay/overlay-init.js';

export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		overlay: {
			type: Boolean,
			default: true
		},
		overlayOpacity: {
			type: Number,
			default: 0.4
		},
		overlayColor: {
			type: String,
			default: '#000'
		}
	},
	mounted() {
		this.$nextTick(function() {
			OverlayShow.open(this);
		})

	},
	destroyed: function() {
		this.$nextTick(function() {
			OverlayShow.close(this);
		})
	},
	beforeDestroy() {
		OverlayShow.close(this);
	},
	watch: {
		show(n, o) {
			if (n) {
				OverlayShow.open(this);
			} else {
				OverlayShow.close(this);
			}
		}
	}
}
