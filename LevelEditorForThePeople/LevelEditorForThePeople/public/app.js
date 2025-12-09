$(function() {
	let blockCounter = 0;

	const $editor = $('#editor');
    const $levelId = $('#level-id');

	//Creating each of the new objects for the game
	function CreateBlock(blockData) {
		const id = blockData.id

		const block = $('<div></div>')
			.addClass('block')
			.attr('id',id)
			.css({
				top: blockData.y,
				left: blockData.x,
				width: blockData.width,
				height: blockData.height,
			})
			.appendTo($editor)
		
		block.draggable({
			containment: "#editor"
		});

		block.on("contextmenu", function (e) {
			e.preventDefault();
			if (confirm("Delete this block")) {
				$(this).remove();
			}
		});

		return block;
    }

    function CreateEnemy(enemyData) {
        const id = enemyData.id

        const enemy = $('<div></div>')
            .addClass('enemy')
            .attr('id', id)
            .css({
                top: enemyData.y,
                left: enemyData.x,
                width: enemyData.width,
                height: enemyData.height,
            })
            .appendTo($editor)

        enemy.draggable({
            containment: "#editor"
        });
        return enemy;
    }
    function CreateCatapult(catapultData) {
        const id = catapultData.id

        const catapult = $('<div></div>')
            .addClass('catapult')
            .attr('id', id)
            .css({
                top: catapultData.y,
                left: catapultData.x,
                width: catapultData.width,
                height: catapultData.height,
            })
            .appendTo($editor)

        catapult.draggable({
            containment: "#editor"
        });
        return catapult;
    }
    function CreateGlass(glassData) {
        const id = glassData.id

        const glass = $('<div></div>')
            .addClass('glass')
            .attr('id', id)
            .css({
                top: glassData.y,
                left: glassData.x,
                width: glassData.width,
                height: glassData.height
            })
            .appendTo($editor)

        glass.draggable({
            containment: "#editor"
        });
        return glass;
    }
    function CreateBeam(beamData) {
        const id = beamData.id

        const beam = $('<div></div>')
            .addClass('beam')
            .attr('id', id)
            .css({
                top: beamData.y,
                left: beamData.x,
                width: beamData.width,
                height: beamData.height
            })
            .appendTo($editor)

        beam.draggable({
            containment: "#editor"
        });
        return beam;
    }
    // Collecting all the objects to allow them to be saved
    function collectObjects() {
        const blocks = [];

        function collect(selector, type) {
            $(selector).each(function () {
                const obj = $(this);
                const pos = obj.position();
                blocks.push({
                    id: obj.attr('id'),
                    x: pos.left,
                    y: pos.top,
                    width: obj.width(),
                    height: obj.height(),
                    type: type
                });
            });
        }
        collect(".block", "block");
        collect(".enemy", "enemy");
        collect(".catapult", "catapult");
        collect(".glass", "glass");
        collect(".beam", "beam");

		return blocks;
	};

    // Rending the game level
	function renderLevel(blocks) {
		$editor.empty();
		blockCounter = 0;
        blocks.forEach(obj => {
            if (obj.type === "block") CreateBlock(obj);
            if (obj.type === "enemy") CreateEnemy(obj);
            if (obj.type === "catapult") CreateCatapult(obj);
            if (obj.type === "glass") CreateGlass(obj);
            if (obj.type === "beam") CreateBeam(obj);
        });
	}

    // Buttons to add new objects to the game 
	$('#add-block').click(function () {
        CreateBlock({});
    });
    $('#add-enemy').click(function () {
        CreateEnemy({});
    });

    $('#add-catapult').click(function () {
        CreateCatapult({});
    });

    $('#add-glass').click(function () {
        CreateGlass({});
    });

    $('#add-beam').click(function () {
        CreateBeam({});
    });

    // Saving the level and assinging it the inputted id
    $('#save-level').click(function () {
        const blocks = collectObjects();

        if (blocks.length === 0) {
            alert('The level is empty. Add some blocks before saving.');
            return;
        }

        const id = $levelId.val().trim();
        const payload = { blocks };

        let method, url;
        if (id) {
            
            method = 'PUT';
            url = '/api/v1/levels/' + encodeURIComponent(id);
        } else {
            method = 'POST';
            url = '/api/v1/levels';
        }

        $.ajax({
            url,
            method,
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (response) {
         
                alert(response.message + ' (ID = ' + response.id + ')');

                if (!id) {
              
                    $levelId.val(response.id);
                }

            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.error || xhr.responseText || 'Unknown error';
                alert('Error saving level: ' + msg);
            }
        });
    });

    // loading saved levels based on its id
    $('#load-level').click(function () {
        const id = $levelId.val().trim();

        if (!id) {
            alert('Please enter a Level ID to load.');
            return;
        }

        const url = '/api/v1/levels/' + encodeURIComponent(id);

        $.ajax({
            url,
            method: 'GET',
            contentType: 'application/json',
            success: function (response) {
                renderLevel(response.blocks || []);
                alert('Level loaded successfully.');
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.error || xhr.responseText || 'Unknown error';
                alert('Error loading level: ' + msg);
            }
        });
    });

    // Deleting the level based on its id
    $('#delete-level').click(function () {
        const id = $levelId.val().trim();

        if (!id) {
            alert('Please enter a Level ID to delete.');
            return;
        }

        if (!confirm(`Are you sure you want to delete level "${id}"?`)) {
            return;
        }

        const url = '/api/v1/levels/' + encodeURIComponent(id);

        $.ajax({
            url,
            method: 'DELETE',
            success: function () {
                alert('Level deleted.');

                $levelId.val('');
                $editor.empty();
            },
            error: function (xhr) {
                const msg = xhr.responseJSON?.error || xhr.responseText || 'Unknown error';
                alert('Error deleting level: ' + msg);
            }
        });
    });

});

