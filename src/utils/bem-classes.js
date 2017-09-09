import classNames from 'classnames';

/* @param bemObj - example
		{
			class: 'base-class',
			modifiers: { '--long': true, '--short': false }
			state: {
				is-active: false,
				disabled: true
			}
		}
 * @returns {string} a properly constructed class string
 */
export default (bemObj) => {
	assertOnlyOneModifier(bemObj.modifier);
	const classModifier = classNames(bemObj.modifier);
	return classNames(`${bemObj.class}${classModifier}`, bemObj.state);
};

function assertOnlyOneModifier(modifierObject) {
	if (modifierObject) {
		const activeModifiers = Object.keys(modifierObject).filter(key =>  modifierObject[key]);
		if (activeModifiers.length > 1) {
			throw new Error(`Multiple modifiers can not be active at the same time ${activeModifiers.toString()}`);
		}
	}
}
