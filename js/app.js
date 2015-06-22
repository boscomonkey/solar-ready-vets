jQuery(document).ready(function() {

    function createId(str) {
        return str
            .toLowerCase()
            .replace(/\W+/g, " ")
            .trim()
            .replace(/\s+/g, "_");
    }

    function onAjaxSuccess(fieldsResult) {
        var fields = fieldsResult.data;		// loaded from JSON
        var fieldMap = {}			// maps field_id to field

        // cycle over elements and tranform fields if necessary
        fields.map(function(fld) {
            // if id is null, transform from question
            if (!fld.id) {
                fld.id = createId(fld.question);
            }

            // if type is null, it defaults to "text"
            if (!fld.type) {
                fld.type = "text";
            }

            // if style is null, defaults to "default"
            if (!fld.style) {
                fld.style = "default";
            }

            // if there are extra parameters, create fully fleshed
            // object array for Handlebars iteration
            if (fld.$extra_params) {
                fld.radio_buttons = fld.$extra_params.map(function(param) {
                    return {
                        name: fld.id,
                        value: param
                    };
                });
            }
        });

        // cycle over fields to build map
        fields.map(function(fld) {
            fieldMap[fld.id] = fld;
        });

        renderFields(fields);
    };

    function renderFields(fields) {
        var types = ['radio', 'text', 'textarea'];
        var type_templates = types.reduce(
            function(memo, type) {
                var id  = '#' + type + '-template';
                var elt = jQuery(id);
                var src = elt.html();
                var tpl = Handlebars.compile(src);

                memo[type] = tpl;
                return memo;
            },
            {}
        );
        var container = jQuery('#form_content');

        // cycle over array of fields and render each fld
        fields.map(function(fld) {
            var typ = fld['type'];
            var tpl = type_templates[typ];
            var htm = tpl(fld);
            container.append(htm);
        });
    };

    $.ajax('data/fields.json', {dataType: "json"})
        .done(onAjaxSuccess);

});
