<script lang="ts">

	let {width = 200, height = 200} = $props();
	let canvas: HTMLCanvasElement = $state()!;
	const colors = {false: "rgb(255 127 0)", true: "rgb(255 255 0)"};
	const size = 20;
	const len = Math.min(width, height) / size;
	let moveRate = $state(10);
	let board: boolean[][] = $state(Array(size).fill(undefined).map((_, i) => Array(size).fill(i >= size / 2)));
	let yin = $state({pos: [len, len], v: [1,1], r: len*0.5, value: true });
	let yang = $state({pos: [width - len, height - len], v: [-1,-1], r: len*0.5, value: false });
	$effect(() => {
		let ctx = canvas.getContext("2d")!;
		ctx.clearRect(0, 0, width, height);
		for (let r = 0; r < size; r++) {
			for (let c = 0; c < size; c++) {
				ctx.fillStyle = ctx.strokeStyle = colors[`${board[r][c]}`];
				ctx.fillRect(c * width / size, r * height / size, width / size, height / size);
				// ctx.strokeRect(c * width / size, r * height / size, width / size, height / size);
			}
		}
		for (let ball of [yin, yang]) {
			ctx.fillStyle = ctx.strokeStyle = colors[`${ball.value}`];
			ctx.beginPath();
			ctx.arc(ball.pos[0], ball.pos[1], ball.r, 0, 2*Math.PI);
			ctx.fill();
		}
	});


	let moveRule = $state(30);
	let last8: number[] = [];
	const changeBlock = (row: number, col: number) => {
		let hash = row * size + col;
		if (!last8.includes(hash)) {
			last8.push(row * size + col);
			if (last8.length > 8) {
				moveRule = 30;
				last8.shift();
			}
		}
		if(moveRule-- < 0) {
			moveRule = 30;
			board = Array(size).fill(undefined).map((_, i) => Array(size).fill(i >= size / 2));
			yin = {pos: [len, len], v: [1,1], r: len*0.5, value: true };
			yang = {pos: [width - len, height - len], v: [-1,-1], r: len*0.5, value: false };
		}
	};

	const move = () => {
		for (let ball of [yin, yang]) {
			let oldpos = ball.pos.slice();
			ball.pos[0] += ball.v[0];
			ball.pos[1] += ball.v[1];
			let yEdge = ball.pos[1] + ball.v[1] * ball.r;
			let row = Math.floor(yEdge / (height/size));
			if (yEdge <= 0 || yEdge >= height) {
				ball.pos[1] = oldpos[1];
				ball.v[1] *= -1;
			} else if (board[row][Math.floor(oldpos[0] / (width/size))] === ball.value) {
				ball.pos[1] = oldpos[1];
				ball.v[1] *= -1;
				board[row][Math.floor(oldpos[0] / (width/size))] = !ball.value;
				changeBlock(row, Math.floor(oldpos[0] / (width/size)));
			}
			let xEdge = ball.pos[0] + ball.v[0] * ball.r;
			let col = Math.floor(xEdge / (width/size));
			if (xEdge < 0 || xEdge > width) {
				ball.pos[0] = oldpos[0];
				ball.v[0] *= -1;
			} else if (board[Math.floor(oldpos[1] / (height/size))][col] === ball.value) {
				ball.pos[0] = oldpos[0];
				ball.v[0] *= -1;
				board[Math.floor(oldpos[1] / (height/size))][col] = !ball.value;
				changeBlock(row, Math.floor(oldpos[0] / (width/size)));
			}
		}
	};

	$effect(() => {
		let id = setInterval(() => {
			for (let i = 0; i < moveRate; i++) {
				move();
			}
		}, 17);
		return () => clearInterval(id);
	});

	const onmouseenter = () => {
		moveRate = 5;
	};
	const onmouseleave = () => {
		moveRate = 10;
	}
</script>

<canvas bind:this={canvas} {width} {height} {onmouseenter} {onmouseleave}>
</canvas>