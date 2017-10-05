<template>
	<aside id="event-panel" :class="{hidden: hidden, neue: event.isNewEvent}">
		<div class="editbox">
			<input type="text" @input="update('title')" class="title" v-model="event.title" placeholder="title">
			<div class="row details">
				<input @input="update" v-model="event.time" name="time" size="8" placeholder="@ time">
				<input @input="update" v-model="event.date" name="date" size="8" placeholder="date">
				<input @input="update" v-model="event.loc"  name="tags" placeholder="location">
			</div>
			<div class="row actions">
				<template v-if="event.isNewEvent == true">
					<button @click="cancel" class="alt">Cancel</button>
					<button @click="create">Create</button>
				</template>
				<template v-else>
					<button @click="cancel" class="alt">Dismiss</button>
					<button @click="del" class="alt">Delete</button>
					<button @click="commit">Commit</button>
				</template>
			</div>
		</div>
	</aside>
</template>

<script>

export default {
	name: 'eventpanel',
	computed: {
	},
	props: ['event', 'hidden'],
	methods: {
		update: function (event) {
			// this.$parent.$emit('edit', [this.task.task, params])
		},
		create: function () {
			let e = {}
			e.time = this.event.time
			e.date = this.event.date
			e.loc = this.event.loc
			e.title = this.event.title
			this.$parent.$emit('create-event', e)
		},
		commit: function () {

		},
		del: function () {

		},
		cancel: function () {
			this.$parent.$emit('dismiss-panel')
		}
	}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';

	#event-panel {
		position: fixed;
		background: $color__grey-dark;
		height: 11 * $pu;
		width: calc(100% - (8 * #{$pu}));
		padding: 1.5*$pu;
		margin: 0 4*$pu 0 4*$pu;
		bottom: 0;
		left: 0;
		transform: translate3D(0, 0, 0);
		transition: transform .4s ease;
		.title {
			font-size: 1.7em;
			color: black;
			font-family: "Helvetica Light";
			width: 100%;
			padding-bottom: $pu / 4;
		}
		input {
			border: none;
			background: transparent;
		}
		.actions {
			position: absolute;
			text-align: right;
			bottom: $pu;
			width: calc(100% - (3 * #{$pu}));
		}
		.details {
			font-variant: oblique;
		}

		// states
		&.neue{
			height: 7 * $pu;
		}
		&.hidden {
			transform: translate3D(0, 11 * $pu, 0);
		}
	}

</style>
