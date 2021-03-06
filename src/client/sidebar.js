/* Copyright (c) 2016 Grant Miner */
"use strict";
import { translate as t } from "./i18n";
const m = require("mithril");
const _ = require("lodash");
const appState = require("./appState");

module.exports.controller = function(args, extras) {
  const ctrl = this;
  ctrl.searchInput = m.prop("");
  ctrl.searchInputChange = function(ev) {
    ctrl.searchInput(ev.target.value);
  };
};

module.exports.view = function(ctrl, args, extras) {
  const state = appState.getState();
  const fleets = _.toArray(state.fleetsByID);

  function formatVehicle(vehicle) {
    if (!vehicle) return "";
    let str = "";
    str += vehicle.name;

    // quick testing
    // vehicle.obd = {
    //     malfunction: true,
    //     diagnosticTroubleCodesCount: 1,
    //     temp: 95,
    //     fuelLevelInput: 97,
    // }
    // vehicle.deviceBatteryPercent = 23;

    if (vehicle.obd) {
      const obd = vehicle.obd;
      var prev = false;
      if (obd.malfunction) {
        str += " ";
        if (
          _.isFinite(obd.diagnosticTroubleCodesCount) &&
          obd.diagnosticTroubleCodesCount > 1
        ) {
          str += obd.diagnosticTroubleCodesCount;
        }
        str += "⚠";
        prev = true;
      }

      // if (obd.temp) {
      //     if (prev) str += " |";
      //     str += ' ' + obd.temp + '℃';
      //     prev = true;
      // }

      if (obd.fuelLevelInput) {
        if (prev) str += " |";
        if (_.isFinite(obd.fuelLevelInput)) {
          str += " " + obd.fuelLevelInput + "%⛽";
        }
        prev = true;
      }
    }

    // if (_.isFinite(vehicle.deviceBatteryPercent)) {
    //     str += ' ' + vehicle.deviceBatteryPercent + '%🔋';
    // }
    return str;
  }

  return m("div.business-table.fullwidth", [
    m("from.form-search", [
      m("input.input-search.fullwidth", {
        onkeyup: ctrl.searchInputChange,
        value: ctrl.searchInput()
      }),
      m("span.middle glyphicon glyphicon-search", {
        style: {
          position: "absolute",
          right: "45px",
          top: "24px"
        },
        onclick: function() {
          ctrl.searchInput("");
        }
      })
    ]),
    m("ul.list-group", [
      // Fleets/All
      m(
        "li.pointer list-group-item",
        {
          class: state.selectedAllFleets ? "active" : "",
          onclick: function(ev) {
            appState.selectFleetAll();
          }
        },
        require("./svg/truck-facing")(12, 12),
        " " + t("Fleets/All")
      ),

      // Individual Fleets
      fleets.map(function(fleet) {
        return [
          m(
            "li.pointer list-group-item",
            {
              class:
                !state.selectedAllFleets &&
                state.selectedFleets.length === 1 &&
                state.selectedFleets[0].id === fleet.id
                  ? "active"
                  : "",
              onclick: function(ev) {
                appState.selectFleet(fleet);
              }
            },
            require("./svg/truck")(12, 12, fleet.color),
            " ",
            m("b", fleet.name)
          ),

          fleet.vehicles
            .filter(function(vid) {
              const vehicle = state.vehiclesByID[vid];
              return (
                ctrl.searchInput() === "" ||
                vehicle.name
                  .toUpperCase()
                  .indexOf(ctrl.searchInput().toUpperCase()) > -1
              );
            })
            .map(function(vid) {
              const vehicle = state.vehiclesByID[vid];
              return m(
                "li.pointer list-group-item",
                {
                  style: {
                    margin: "0 0 0 15px"
                  },
                  class:
                    state.selectedVehicle &&
                    vehicle &&
                    state.selectedVehicle.id === vehicle.id
                      ? "active"
                      : "",
                  onclick: function(ev) {
                    appState.selectVehicleByID(vehicle.id);
                  }
                },
                formatVehicle(vehicle)
              );
            })
        ];
      })
    ])
  ]);
};
