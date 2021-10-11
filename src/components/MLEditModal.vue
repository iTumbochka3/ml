<template>
  <b-modal
      id="ml-edit-modal"
      title="Добавить маршрутный лист"
      >
    <b-container>
      <b-row>
        <b-col>
          <label for="input-counterparty">Перевозчик</label>
          <v-select
              id="input-counterparty"
              label="name"
              :options="counterPartyList"
              :value="(counterParty) ? counterParty.name : ''"
              v-debounce="searchCounterparty"
              @input="setCounterParty"

          >
            <span slot="no-options"></span>
          </v-select>
        </b-col>
        <b-col>
          <label>Договор</label>
          <b-form-select
              v-model="contract"
              :options="contractList"
              :disabled="!counterParty"
          />
        </b-col>
      </b-row>

      <b-row class="pt-3">
        <b-col>
          <label>Дата погрузки</label>
          <b-input-group class="mb-3">
            <b-form-input
                v-model="dateLoading"
                type="text"
            />
            <b-input-group-append>
              <b-form-datepicker
                  v-model="dateLoading"
                  button-only
                  right
                  locale="ru-RU"
              />
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col>
<!--          <label>Дата выгрузки</label>-->
<!--          <b-input-group class="mb-3">-->
<!--            <b-form-input-->
<!--                v-model="dateUnloading"-->
<!--                type="text"-->
<!--                placeholder="DD.MM.YYYY"-->
<!--                autocomplete="off"-->
<!--            />-->
<!--            <b-input-group-append>-->
<!--              <b-form-datepicker-->
<!--                  v-model="dateUnloading"-->
<!--                  button-only-->
<!--                  right-->
<!--                  locale="en-US"-->
<!--                  aria-controls="example-input"-->
<!--              />-->
<!--            </b-input-group-append>-->
<!--          </b-input-group>-->
        </b-col>
      </b-row>

      <hr/>

      <b-row>
        <b-col>
          <label>Водитель</label>
          <b-form-select
              v-model="individual"
              :options="driverList"
              :disabled="!counterParty"
          />
        </b-col>
        <b-col>
          <label>ТС</label>
          <b-form-select
              v-model="truck"
              :options="vehicleList"
              :disabled="!counterParty"
          />
        </b-col>
        <b-col>
          <label>Прицеп</label>
          <b-form-select
              v-model="trailer"
              :options="trailerList"
              :disabled="!counterParty"
          />
        </b-col>
      </b-row>
    </b-container>

    <template #modal-footer>
<!--      <p>Ошибка: У водителя отсутствует какой то там документ</p>-->
<!--      <b-button-->
<!--          variant="outline-primary"-->
<!--          class="float-right"-->
<!--          @click="console.log()"-->
<!--      >-->
<!--        Отмена-->
<!--      </b-button>-->
      <b-button
          variant="primary"
          class="float-right"
          @click="saveData"
      >
        Добавить
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import moment from 'moment';

export default {
  name: "MLEditModal",
  mounted() {
    this.dateLoading = moment().format("DD.MM.YYYY")
    this.dateUnloading = moment().add(2, "days").format("DD.MM.YYYY");
  },
  data() {
    return{
      counterParty: '',
      contract: '',
      dateLoading: '',
      dateUnloading: '',
      individual: '',
      truck: '',
      trailer: '',
    }
  },
  computed: {
    counterPartyList() {
      return this.$store.state.counterPartyList;
    },
    contractList() {
      return this.$store.state.contracts.map(item => {
        return {
          text: item.name,
          value: item
        }
      });
    },
    driverList() {
      return this.$store.state.drivers.map(item => {
        return {
          text: item.name,
          value: item
        }
      });
    },
    vehicleList() {
      return this.$store.state.vehicles.map(item => {
        return {
          text: item.number,
          value: item
        }
      });
    },
    trailerList() {
      return this.$store.state.trailers.map(item => {
        return {
          text: item.number,
          value: item
        }
      });
    },
  },
  methods: {
    async searchCounterparty(search) {
      await this.$store.dispatch('requestCounterPartyList', search)
    },

    setCounterParty(value) {
      this.counterParty = value;
      this.$store.dispatch('requestContracts', value.uuid);
      this.$store.dispatch('requestDrivers', value.uuid);
      this.$store.dispatch('requestVehicles', value.uuid);
      this.$store.dispatch('requestTrailers', value.uuid);
    },

    saveData() {
      this.$store.dispatch('createNewSheet', {
        counterParty: this.counterParty,
        contract: this.contract,
        dateLoading: this.dateLoading,
        dateUnloading: this.dateUnloading,
        individual: this.individual,
        truck: this.truck,
        trailer: this.trailer,
      });
    },
  }
}
</script>

<style lang="scss">
</style>