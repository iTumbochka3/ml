import Vuex from 'vuex';
import Vue from 'vue';
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        sheets: [
            // {
            //     counterparty_uuid: 'Либрасофт ООО (Тестирование)',
            //     contract_uuid: 'Нет',
            //     phone_number: '+7(918)385-71-44',
            //     date_loading: '18.06.2021',
            //     date_unloading: '18.06.2021',
            //     individual_uuid: 'Дмитриева Константин Олегович',
            //     trailer_uuid: 'А 543 КХ 123',
            //     result: 'Описание ошибки'
            // },
            // {
            //     counterparty_uuid: 'Либрасофт ООО (Тестирование)',
            //     contract_uuid: 'Нет',
            //     phone_number: '+7(918)385-71-44',
            //     date_loading: '18.06.2021',
            //     date_unloading: '18.06.2021',
            //     individual_uuid: 'Дмитриева Константин Олегович',
            //     trailer_uuid: 'А 543 КХ 123',
            //     result: 'Описание ошибки'
            // },
        ],
        counterPartyList: [],
        contracts: [],
        drivers: [],
        vehicles: [],
        trailers: [],
    },
    actions: {
        createNewSheet({commit}, {
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

        sendSheets({commit}, result) {
            axios.request({
              url: '/api/test/v1/tek/need-route-sheet-add',
              method: 'POST',
              baseURL: 'https://testapi2.sanador.ru',
              headers: {
                'Authorization': 'Bearer CM6mmVpS3NkvG97HZ4DZIqkD9CpbIqTad6S6XRtP6DQhCoM7aO95QAwZT9ty6KqCkkBP30d9Mh3qw5Wj0zQ4iYSr6tURBy1a6iHb',
              },
              data: {
                'sheets': result,
              }
            }).then(response => {
              console.log(response);
              //фильтрация sheets по успешным
                let errors = response.data.map(item => {
                    if(item.result_ok === false) {
                        return item.line_uuid
                    }
                })
                console.log('errors', errors);
                const filtered = result;
                commit('SET_SHEETS', filtered)
            })
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
                    commit('SET_COUNTER_PARTY_LIST', response.data.data)
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