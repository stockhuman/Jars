<template>
	<div class="event no-select" @click="viewEvent(event)">
		<h2>{{event.title}}</h2>
		<div class="event-details">
			<span v-if="event.location != ''">{{event.location}} </span>
			<span v-if="event.time != ''">@ {{event.time}}</span>
		</div>
	</div>
</template>

<script>

export default {
	name: 'event',
	data: () => ({}),
	computed: {
		time () {
			return event[2]
		}
	},
	props: ['event'],
	methods: {
		viewEvent: function (event) {
			this.$parent.$emit('view-event', event)
		}
	}
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.event-results {
	padding-left: 2.5 * $u;
	.event {
		margin-bottom: $u / 2;
		h2 {
			font-size: 20px;
			color: black;
			cursor: pointer;
		}
		.event-details {
			font-family: "Helvetica Light";
			font-style: oblique;
			color: $color__grey;
			font-size: 12px;
		}
	}
}
</style>
