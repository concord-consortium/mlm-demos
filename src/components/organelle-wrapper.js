/*globals Organelle Snap */
import React, { Component } from 'react';

let model;

export default class OrganelleWrapper extends Component {
  constructor(props) {
    super(props);
    this.showHexBinding = this.showHexBinding.bind(this)
  }

  componentDidMount() {
    const {modelProperties} = this.props;
    modelProperties["receptor_is_bound"] = false;

    // var initialDrakeColor = "lava",
    //     finalDrakeColor = "charcoal",
    //     alleles,
    //     numStars,
    //     gameType = "size", // "gate", "nucleus"
    //     isNucleusGame = false,
    //     nucleusGenes,
    //     gameUrl = "https://www.fablevision.com/geniverse_proteins/index.html?allele-shorthand=10111111&initial-state=size&target-color=lava",
    //     parentPhone

    Organelle.createModel({
      element: "model",
      background: {
        file: "assets/melanocyte.svg",
        selector: "#cell"
      },
      properties: modelProperties,
      calculatedProperties: {
        saturation: {
          ratio: {
            numerator: {
              count: {
                species: "melanosome",
                state: [
                  "waiting_on_actin_terminal",
                  "waiting_on_nuclear_actin_terminal"
                ],
              }
            },
            denominator: 20
          }
        },
        lightness: {
          ratio: {
            numerator: {
              count: {
                species: "melanosome",
                state: "waiting_on_nuclear_actin_terminal"
              }
            },
            denominator: 10
          }
        },
        grayness: {
          ratio: {
            numerator: {
              count: {
                species: "melanosome",
                state: [
                  "waiting_on_actin_terminal",
                  "waiting_on_nuclear_actin_terminal"
                ],
                rules: {
                  fact: "size",
                  greaterThan: 0.7
                }
              }
            },
            denominator: {
              count: {
                species: "melanosome",
                state: ["waiting_on_actin_terminal", "waiting_on_nuclear_actin_terminal"],
                rules: {
                  fact: "size",
                  lessThan: 0.7
                }
              }
            }
          }
        }
      },
      clickHandlers: [],
      species: [
        // "organelles/melanosome.yml",
        // "organelles/zoomed-melanosome.yml",
        "organelles/hexagon.yml",
        "organelles/triangle.yml",
        "organelles/g-protein.yml",
        "organelles/g-protein-part.yml"
      ]
    }).then((m) => {
      model = m;
    });
  }

  showHexBinding() {
    var hex = model.world.createAgent(model.world.species[0]);
    hex.state = "heading_to_receptor";

    var transformReceptor = function() {
      // var protein = Snap.select("#receptor_x5F_protein");

      document.getElementById("sensor_0_Layer0_0_FILL").style["fill"] = "rgb(239,1,82)";
      document.getElementById("piece1_0_Layer0_0_FILL").style["fill"] = "rgb(239,1,82)";
    }

    var _this = this;
    var gProteinPart;

    var waitingForGProteinPart = function() {
      if (gProteinPart.dead) {
        hex.task_die(true);

        document.getElementById("sensor_0_Layer0_0_FILL").style["fill"] = "rgb(201, 56, 104)";
        document.getElementById("piece1_0_Layer0_0_FILL").style["fill"] = 'url("#_Radial5")';
        model.world.setProperty("receptor_is_bound", false);
        model.world.agents[0].state = "away_from_receptor";
        _this.props.setGraphState("B");
      } else {
        model.setTimeout(waitingForGProteinPart, 500)
      }
    }

    var waitingForGProtein = function() {
      if (model.world.agents[0].state === "stick_to_receptor") {
        _this.props.setGraphState("AB3");
        gProteinPart = model.world.createAgent(model.world.species[3]);
        model.setTimeout(waitingForGProteinPart, 500)
      } else {
        model.setTimeout(waitingForGProtein, 500)
      }
    }

    var waitingForBinding = function() {
      if (hex.state === "waiting_on_receptor") {
        transformReceptor();
        model.world.setProperty("receptor_is_bound", true);
        _this.props.setGraphState("AB2");
        waitingForGProtein();
      } else {
        model.setTimeout(waitingForBinding, 500)
      }
    }
    
    model.setTimeout(waitingForBinding, 500)
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.modelProperties) {
      Object.keys(nextProps.modelProperties).forEach(function (key) {
        model.world.setProperty(key, nextProps.modelProperties[key]);
      });
    }

    if (!this.props.showBinding && nextProps.showBinding) {
      this.showHexBinding();
    }
  }

  render() {
    return <svg id="model" width="1200px" viewBox="0 0 1280 800" className="model" />;
  }
}