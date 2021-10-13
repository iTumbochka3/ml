import Vuex from 'vuex';
import Vue from 'vue';
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        sheets: [
        ],
        counterPartyList: [],
        contracts: [],
        drivers: [],
        vehicles: [],
        trailers: [],
    },
    getters: {
        getSheets(state) {
            return state.sheets;
        }
    },
    actions: {
        createSheet({commit}, {
            counterParty,
            contract,
            dateLoading,
            dateUnloading,
            individual,
            truck,
            trailer,
        }) {
            const sheet = {
                counterparty: counterParty,
                contract: contract,
                individual: individual,
                truck: truck,
                trailer: trailer,
                date_loading: dateLoading,
                date_unloading: dateUnloading
            }
            commit('ADD_SHEET', sheet)
        },

        editSheet({commit, getters}, {
            editIndex,
            counterParty,
            contract,
            dateLoading,
            dateUnloading,
            individual,
            truck,
            trailer,
        }) {
            const newSheet = {
                counterparty: counterParty,
                contract: contract,
                individual: individual,
                truck: truck,
                trailer: trailer,
                date_loading: dateLoading,
                date_unloading: dateUnloading
            }

            let result = getters.getSheets.map((item, index) => {
                if (index === editIndex) {
                    return newSheet;
                } else {
                    return item;
                }
            });

            commit('SET_SHEETS', result);
        },

        deleteSheet({commit, getters}, deleteIndex) {
            let sheets = getters.getSheets.filter((item, index) => deleteIndex !== index);
            commit('SET_SHEETS', sheets);
        },

        sendSheets({commit,getters}, result) {
            axios.request({
              url: '/api/test/v1/need-route-sheet-add',
              method: 'POST',
              baseURL: 'https://testapi2.sanador.ru',
              headers: {
                'Authorization': 'Bearer CM6mmVpS3NkvG97HZ4DZIqkD9CpbIqTad6S6XRtP6DQhCoM7aO95QAwZT9ty6KqCkkBP30d9Mh3qw5Wj0zQ4iYSr6tURBy1a6iHb',
              },
              data: {
                'sheets': result,
              }
            }).then(response => {
                let errorItems = [];
                if (response.data.data) {
                    errorItems = response.data.data.map(item => {
                        if (item.result_ok === false) {
                            return {
                                uuid: item.line_uuid,
                                text: item.result_text
                            }
                        }
                    })
                }

                let filtered = []
                getters.getSheets.forEach((item, index) => {
                    if (errorItems.map(item => item.uuid).indexOf((index+1).toString()) > -1) {
                        filtered.push(
                            {
                                counterparty: item.counterparty,
                                contract: item.contract,
                                individual: item.individual,
                                truck: item.truck ? item.truck : '',
                                trailer: item.trailer ? item.trailer : '',
                                date_loading: item.date_loading,
                                date_unloading: item.date_unloading,
                                result_text: errorItems.find(item => item.uuid-1 === index).text
                            }
                        )
                    }
                })
                commit('SET_SHEETS', filtered);
            })
        },

        clearCounterPartyList({commit}) {
            commit('SET_COUNTER_PARTY_LIST', []);
        },

        requestCounterPartyList({commit}, name) {
            if(name) {
                axios.request({
                    url: '/api/test/v1/counterparty',
                    method: 'POST',
                    baseURL: 'https://testapi2.sanador.ru',
                    headers: {
                        'Authorization': 'Bearer CM6mmVpS3NkvG97HZ4DZIqkD9CpbIqTad6S6XRtP6DQhCoM7aO95QAwZT9ty6KqCkkBP30d9Mh3qw5Wj0zQ4iYSr6tURBy1a6iHb',
                    },
                    data: {
                        'name': name,
                    }
                }).then(response => {
                    commit('SET_COUNTER_PARTY_LIST', response.data.data);
                })
            }
        },

        requestContracts({commit}, counterparty_uuid) {
            axios.request({
                url: '/api/test/v1/contracts',
                method: 'POST',
                baseURL: 'https://testapi2.sanador.ru',
                headers: {
                    'Authorization': 'Bearer CM6mmVpS3NkvG97HZ4DZIqkD9CpbIqTad6S6XRtP6DQhCoM7aO95QAwZT9ty6KqCkkBP30d9Mh3qw5Wj0zQ4iYSr6tURBy1a6iHb',
                },
                data: {
                    'organisation_uuid': 'eef076a0-d275-11e6-843e-bcaec5369a36',
                    'counterparty_uuid': counterparty_uuid,
                }
            }).then(response => {
                commit('SET_CONTRACTS', response.data.data)
            })
        },

        requestDrivers({commit}, counterparty_uuid) {
            axios.request({
                url: '/api/test/v1/driver',
                method: 'POST',
                baseURL: 'https://testapi2.sanador.ru',
                headers: {
                    'Authorization': 'Bearer CM6mmVpS3NkvG97HZ4DZIqkD9CpbIqTad6S6XRtP6DQhCoM7aO95QAwZT9ty6KqCkkBP30d9Mh3qw5Wj0zQ4iYSr6tURBy1a6iHb',
                },
                data: {
                    'counterparty_uuid': counterparty_uuid,
                }
            }).then(response => {
                commit('SET_DRIVERS', response.data.data)
            })
        },

        requestVehicles({commit}, counterparty_uuid) {
            axios.request({
                url: '/api/test/v1/vehicle',
                method: 'POST',
                baseURL: 'https://testapi2.sanador.ru',
                headers: {
                    'Authorization': 'Bearer CM6mmVpS3NkvG97HZ4DZIqkD9CpbIqTad6S6XRtP6DQhCoM7aO95QAwZT9ty6KqCkkBP30d9Mh3qw5Wj0zQ4iYSr6tURBy1a6iHb',
                },
                data: {
                    'counterparty_uuid': counterparty_uuid,
                    'type': 1,
                }
            }).then(response => {
                commit('SET_VEHICLES', response.data.data)
            })
        },

        requestTrailers({commit}, counterparty_uuid) {
            axios.request({
                url: '/api/test/v1/vehicle',
                method: 'POST',
                baseURL: 'https://testapi2.sanador.ru',
                headers: {
                    'Authorization': 'Bearer CM6mmVpS3NkvG97HZ4DZIqkD9CpbIqTad6S6XRtP6DQhCoM7aO95QAwZT9ty6KqCkkBP30d9Mh3qw5Wj0zQ4iYSr6tURBy1a6iHb',
                },
                data: {
                    'counterparty_uuid': counterparty_uuid,
                    'type': 2,
                }
            }).then(response => {
                commit('SET_TRAILERS', response.data.data)
            })
        },
    },
    mutations: {
        ADD_SHEET(state, sheet) {
            state.sheets = state.sheets.concat(sheet);
        },
        SET_SHEETS(state, sheets) {
            state.sheets = sheets;
        },
        SET_COUNTER_PARTY_LIST(state, counterPartyList) {
            state.counterPartyList = counterPartyList;
        },
        SET_CONTRACTS(state, contracts) {
            state.contracts = contracts;
        },
        SET_DRIVERS(state, drivers) {
            state.drivers = drivers;
        },
        SET_VEHICLES(state, vehicles) {
            state.vehicles = vehicles;
        },
        SET_TRAILERS(state, trailers) {
            state.trailers = trailers;
        },
    }
});