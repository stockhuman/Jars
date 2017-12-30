<template>
	<div>
		<p>{{ds.commits}}</p>
		<p>{{ts}}</p>
		<canvas id="tsdata-canvas"></canvas>
	</div>
</template>

<script>
export default {
	name: 'grapher',
	computed: {},
	props: ['ds', 'ts'],
	mounted () {
		const c = document.getElementById('tsdata-canvas')
		this.canvas = c
		this.ctx = c.getContext('2d')
		this.run()
		window.addEventListener('resize', this.sizeCanvas, false)
	},
	data: () => ({
		pts: [], // data points in the spline or scatter graph
		canvas: undefined,
		ctx: undefined
	}),
	watch: {
		ts: function () {
			this.computePoints(this.canvas)
			this.drawSpline(this.ctx)
		}
	},
	methods: {
		run: function () {
			this.sizeCanvas(this.canvas, this.ctx)
			this.computePoints(this.canvas)
			this.drawSpline(this.ctx)
		},
		computePoints: function (c) {
			this.pts = [] // reset points
			const w = c.width
			const h = c.height
			if (this.ds.commits.length > 0) {
				let data = [undefined, undefined]
				let i = this.ds.commits.length - 1
				switch (this.ts) {
				case 'today':
					data = [this.ds.commits[i][2], i]
					break
				case 'month':
					data = [this.ds.commits.length, parseFloat(this.ds.commits[i][2])]
					break
				case 'year':
				case 'all':
					data = [this.ds.commits.length, (parseFloat(this.ds.commits[i][1] / h))]
					break
				}
				console.log('----' + this.ts + '----')
				while (i >= 0) {
					let x = (i / data[0]) * w
					let y = h - data[1]
					console.log('x: ' + x + ' y: ' + y)
					this.pts.push({x: x, y: y})
					i--
				}
				console.log('----/' + this.ts + '----')
			} else {
				this.pts.push({x: 0, y: 0}, {x: 0, y: 0})
			}
		},
		drawSpline: function (ctx) {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.translate(0.5, 0.5)
			ctx.strokeStyle = '#00AEEF'
			ctx.moveTo((this.pts[0].x), this.pts[0].y)

			for (let i = 0; i < this.pts.length - 1; i++) {
				let xMid = (this.pts[i].x + this.pts[i + 1].x) / 2
				let yMid = (this.pts[i].y + this.pts[i + 1].y) / 2
				let cpX1 = (xMid + this.pts[i].x) / 2
				// let cpY1 = (yMid + this.pts[i].y) / 2
				let cpX2 = (xMid + this.pts[i + 1].x) / 2
				// let cpY2 = (yMid + this.pts[i+1].y) / 2

				ctx.quadraticCurveTo(cpX1, this.pts[i].y, xMid, yMid)
				ctx.quadraticCurveTo(cpX2, this.pts[i + 1].y, this.pts[i + 1].x, this.pts[i + 1].y)
				ctx.stroke()
			}
			ctx.arc(
				this.pts[this.pts.length - 1].x,
				this.pts[this.pts.length - 1].y,
				2, 0, Math.PI * 2, false
			)
			ctx.stroke()
		},
		sizeCanvas: function () {
			const rect = this.canvas.getBoundingClientRect()
			let bspr = this.ctx.backingStorePixelRatio || 1
			let ratio = (window.devicePixelRatio || 1) / bspr

			this.canvas.width = rect.width
			this.canvas.height = rect.height

			if (ratio > 1) {
				this.canvas.style.height = this.canvas.height + 'px'
				this.canvas.style.width = this.canvas.width + 'px'
				this.canvas.width *= ratio
				this.canvas.height *= ratio
			}
		}
	}
}
</script>

<style lang="scss">
	@import '../../assets/scss/variables';
	#tsdata-canvas {
		width: 100%;
		max-height: 300px;
		border: 1px solid black;
	}
</style>
