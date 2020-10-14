const template = require('./template');

module.exports.test = function () {
	return `
		${template.header()}
<div class="container" style="margin-top: 90px;">  

</div>

		${template.footer()}
    `;
}