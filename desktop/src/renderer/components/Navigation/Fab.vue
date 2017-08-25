<template>
	<div id="fab-button" class="fab" :class="{active: fabActive}" >
		<div class="plus-icon" @click="fabActive = !fabActive">
			<span></span>
			<span></span>
		</div>
		<div class="row actions">
			<button @click="newTask">New Task</button>
			<button @click="newEvent">New Event</button>
		</div>
	</div>
</template>

<script>

export default {
	name: 'fab',
	data: () => ({
		fabActive: false
	}),
	methods: {
		newTask: function () {
			this.$parent.$emit('fab-action', 'task')
		},
		newEvent: function () {
			this.$parent.$emit('fab-action', 'event')
		}
	}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';

	.fab {
		position: absolute;
		overflow: hidden;
		bottom: 5em;
		right: 2em;
		width: 3em;
		height: 3em;
		background: #00aeef;
		cursor: pointer;
		border-radius: 1.5em;
		transition: width .3s ease .2s;
		&:hover {
			background: lighten(#00aeef, 10%);
		}
		.actions {
			visibility: hidden;
		  opacity: 0;
			transition: visibility 0s, opacity 0.8s linear;
			padding: .3em;
		}
		.plus-icon {
			position: absolute;
			right: .15em;
			bottom: -.40em;
			transform-origin: 100% 50%;
			transition: transform .2s ease;
			padding: 2em;
			span {
				position: absolute;
				width: 1.2em;
				background: white;
				height: 2px;
				&:nth-of-type(1) {
					transform: rotateZ(90deg);
				}
			}
		}
	}

	.fab.active {
		width: calc(100% - 4em);
		border-radius: 3px;
		transition: width .3s ease, border-radius .2 ease .8s;
		.plus-icon span:nth-of-type(1) {
			display: none;
		}
		.actions {
			visibility: visible;
		  opacity: 1;
			button {
				border-radius: 3px;
				background: #262233;
				border: 0;
				&:hover {
					background: darken(#262233, 10%);
				}
			}
		}
	}
</style>
