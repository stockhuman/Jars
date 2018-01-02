<template>
	<aside id="event-panel" :class="{hidden: hidden, neue: event.isNew}" @keyup.esc="cancel()">
		<div class="editbox">
			<input type="text" @input="update('title')" class="title" v-model="event.title" placeholder="title">
			<div class="row details">
				<input @input="update" v-model="event.time" name="time" size="8" placeholder="time">
				<input @input="update" v-model="event.nicedate" name="date" size="8" placeholder="date">
				<input @input="update" v-model="event.location"  name="tags" placeholder="location">
			</div>
			<div v-if="event.isNew == false" class="row commit-time">
				<input id="evt-commit-hours" name="commit-time-input" type="text" placeholder="0" size="4">
				<label for="commit-time-input">hours</label>
			</div>
			<div class="row actions">
				<template v-if="event.isNew == true">
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
		update: function () {
			// TODO: more efficient saving
			this.$parent.$emit('update-event', this.event)
		},
		create: function () {
			this.$parent.$emit('create-event', {
				time: this.event.time,
				nicedate: this.event.nicedate,
				location: this.event.location,
				title: this.event.title
			})
		},
		commit: function () {
			const hrs = document.getElementById('evt-commit-hours')
			if (hrs.value !== '') {
				if (!isNaN(hrs.value)) {
					this.event.commit = hrs.value
					this.$parent.$emit('commit-event', this.event)
				}
			}
		},
		del: function () {
			this.$parent.$emit('delete-event', this.event)
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
		height: 11 * $u;
		width: calc(100% - (2 * #{$u}));
		padding: 1.5*$u;
		margin: 0 $u 0 $u;
		bottom: 0;
		left: 0;
		transform: translate3D(0, 0, 0);
		transition: transform .4s ease;
		.title {
			font-size: 1.7em;
			color: black;
			font-family: "Helvetica Light";
			width: 100%;
			padding-bottom: $u / 4;
		}
		input {
			border: none;
			background: transparent;
		}
		.actions {
			position: absolute;
			text-align: right;
			bottom: $u;
			width: calc(100% - (3 * #{$u}));
		}
		.details {
			font-variant: oblique;
		}

		.commit-time {
			padding-top: $u;
			input {
				font-size: 80px;
				font-family: "Helvetica Light";
				margin-bottom: 8px;
				&::placeholder {
					color: lighten($color__grey, 20%);
				}
				&:focus {
					box-shadow: none;
				}
			}
			label {
				font-size: 12px;
				font-style: italic;
				display: block;
			}
		}

		// states
		&.neue{
			height: 7 * $u;
		}
		&.hidden {
			transform: translate3D(0, 11 * $u, 0);
		}
	}
</style>
