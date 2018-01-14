export const omit = (keys, obj) =>
	Object.entries(obj)
		.filter(([ key ]) => !keys.includes(key))
		.reduce((acc, [key, value]) => Object.assign({}, acc, {
			[key]: value,
		}), {});
