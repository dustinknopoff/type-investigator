<script lang="ts">
	type SpinnerTypes = {
        size: string | number;
        color: string;
        unit: string;
        duration: string;
        pause: boolean;
    };

	interface Props {
		color?: SpinnerTypes['color'];
		unit?: SpinnerTypes['unit'];
		duration?: SpinnerTypes['duration'];
		size?: SpinnerTypes['size'];
		pause?: SpinnerTypes['pause'];
	}

	let {
		color = '#FF3E00',
		unit = 'px',
		duration = '0.75s',
		size = '60',
		pause = false
	}: Props = $props();
</script>

<div
	class="circle"
	class:pause-animation={pause}
	style="--size: {size}{unit}; --color: {color}; --duration: {duration}"
></div>

<style>
	.circle {
		height: var(--size);
		width: var(--size);
		border-color: var(--color) transparent var(--color) var(--color);
		border-width: calc(var(--size) / 15);
		border-style: solid;
		border-image: initial;
		border-radius: 50%;
		animation: var(--duration) linear 0s infinite normal none running rotate;
	}
	.pause-animation {
		animation-play-state: paused;
	}
	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>