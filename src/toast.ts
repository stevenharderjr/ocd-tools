import { toasts } from './stores';

type ToastType = 'info' | 'error' | 'success';

interface Toast {
	id: string;
	message: string;
	active: boolean;
	type: ToastType;
	blur: boolean;
	dismissable: boolean;
	duration: number;
	timeout: ReturnType<typeof setTimeout>;
	dismiss: () => void;
}

interface ToastOptions {
	// when "replace" is set to true, all/any other toasts will be immediately dismissed
	replace?: boolean;
	// any of the following properties that exist will override Toast defaults
	message?: string;
	id?: string;
	active?: boolean;
	type?: ToastType;
	blur?: boolean;
	dismissable?: boolean;
	duration?: number;
	huge?: boolean;
}

type OptionsOrMessage = string | ToastOptions;

class Toaster {
	count: number;

	constructor() {
		this.count = 0;
	}

	add(options: OptionsOrMessage) {
		if (typeof options === 'string') options = { message: options };
		const id = '' + this.count++;
		// @ts-expect-error: message and timeout properties will be added
		const base: Toast = {
			id,
			active: false,
			type: 'info',
			blur: true,
			dismissable: true,
			duration: 2000,
			dismiss: () => this.dismiss(id)
		};

		const toast = { ...base, ...options };
		if (toast.duration) toast.timeout = setTimeout(toast.dismiss, toast.duration);

		toasts.update((all) => (options?.replace ? [toast] : [...all, toast]) as never);

		return id;
	}

	dismiss(toastId: string) {
		toasts.update((all) =>
			all.filter((toast: Toast) => {
				if (toast.id !== toastId) return true;
				this.count--;
				clearTimeout(toast.timeout);
			})
		);
	}
}

const Toast = new Toaster();

export default Toast;
