class Handler {
	constructor() {
		this.touchMove = this.touchMove?.bind(this);
	}

	touchMove(callback: (coords: [number, number]) => void) {
		return (event: TouchEvent) => {
			const [{ clientX: x, clientY: y }] = event.touches;
			callback([x, y]);
		};
	}

	drag(callback: (coords: [number, number]) => void) {
		return (event: DragEvent) => {
			const { clientX: x, clientY: y } = event;
			callback([x, y]);
		};
	}
}
