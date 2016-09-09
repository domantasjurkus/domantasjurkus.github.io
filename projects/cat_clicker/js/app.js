$(function(){

    var model = {
        cat_names: ["Pew", "Die", "Pie", "Foo", "Bar"],
        cats: [],
        current_cat_ind: 0,

        init: function() {
            model.cat_names.forEach(function(cat){
                model.cats.push({
                    name: cat,
                    count: 0,
                    img_url: "img/"+cat.toLowerCase()+".jpg"
                });
            });
        }
    };


    var octopus = {
        init: function() {
            model.init();
            view.init();
        },
        getCats: function() {
            return model.cats;
        },
        getCat: function(ind) {
            return model.cats[ind];
        },
        setCurrentCat: function(ind) {
            model.current_cat = ind;
        },
        getCurrentCat: function() {
            return model.current_cat;
        },
        incCounter: function(ind) {
            model.cats[ind].count++;
        },
        updateCurrentCat: function() {
            ind = octopus.getCurrentCat();
            cat_obj = octopus.getCat(ind);

            new_name = $("#inp-name").val();
            new_url = $("#inp-url").val();
            new_count = $("#inp-cnt").val();

            if (new_name != "") {
                model.cats[ind].name = new_name;
                view.animateElement($("#cat-name"));
            }

            if (new_url != "") {
                // if JS had access to local storage,
                // we could check if this exists, but
                // for now, let's keep it like this.
                model.cats[ind].img_url = new_url;
            }

            if (new_count != "" && Number(new_count)) {
                model.cats[ind].count = Number(new_count);
                view.animateElement($("#click-counter"));
            }
        },
        clearInputs: function() {
            $("#inp-name").val("");
            $("#inp-url").val("");
            $("#inp-cnt").val("");
        }
    };


    var view = {
        init: function() {
            view.renderSidebar();

            // add event listener for Admin Mode
            $("#admin-button").click(function() {
                $("#admin-form-div").css("visibility", "visible");
            });
            // Save button listener
            $("#save-button").click(function() {
                octopus.updateCurrentCat();
                $("#admin-form-div").css("visibility", "hidden");
                octopus.clearInputs();
                view.renderSidebar();
                view.render();
            });
            // Cancel button listener
            $("#cancel-button").click(function() {
                $("#admin-form-div").css("visibility", "hidden");
                octopus.clearInputs();
            });
        },

        animateElement: function(jq_element) {
            jq_element.animate({
                top: "-=10px"
            }, 100, function() {
                jq_element.animate({
                    top: "+=10px"
                }, 80);
            });
        },

        renderSidebar: function() {
            $("#cat-list").html('');
            //octopus.getCats().forEach(function(cat) {
            cat_array = octopus.getCats();
            for (var i = 0; i < cat_array.length; i++) {
                elem = document.createElement("li");
                elem.textContent = cat_array[i].name;
                elem.className = "cat-elem";

                // event listener for sidebar selection
                elem.addEventListener("click", (function(i){
                    return function() {
                        octopus.setCurrentCat(i);
                        view.render();
                    }
                })(i));
                $("#cat-list").append(elem);
            };
        },

        render: function(){
            // get cat object from the model
            ind = octopus.getCurrentCat();
            cat_obj = octopus.getCat(ind);

            // clear previous event handler, update html
            $("#cat-img").off( "click");
            $("#cat-img").attr("src", cat_obj.img_url);

            // event listened for image click
            $("#cat-img").click(function() {
                octopus.incCounter(ind);
                view.animateElement($("#click-counter"));
                view.render();
            });
            $("#cat-name").html(cat_obj.name);
            $("#click-counter").text(cat_obj.count);
        }
    };

    octopus.init();
});