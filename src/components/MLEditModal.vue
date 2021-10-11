<template>
    <div class="p-5">
      <h1>Добавить маршрутный лист</h1>

      <div class="main-block pt-2">
        <div class="main-block__child">
          <label for="input-counterparty">Перевозчик</label>
          <v-select
              id="input-counterparty"
              label="name"
              :options="counterPartyList"
              :value="(counterParty) ? counterParty.name : ''"
              v-debounce="searchCounterparty"
              @input="setCounterParty"
          >
            <span slot="no-options">Ничего не найдено</span>
          </v-select>
        </div>
        <div class="main-block__child">
          <label>Договор</label>
          <b-form-select
              v-model="contract"
              :options="contractList"
              :disabled="!counterParty"
              :required="true"
          />
        </div>
      </div>

      <div class="main-block pt-4">
        <div class="main-block__child">
          <label>Дата погрузки</label>
          <b-input-group class="mb-3">
            <b-form-input
                id="example-input"
                v-model="dateLoading"
                type="text"
                aria-invalid="false"
            ></b-form-input>
            <b-input-group-append>
              <b-form-datepicker
                  :value="dateLoading"
                  button-only
                  :date-format-options="{ day: '2-digit', month: 'numeric', year: 'numeric' }"
                  @context="onContextLoading"
              ></b-form-datepicker>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="main-block__child">
<!--          <label>Дата выгрузки</label>-->
<!--          <b-input-group class="mb-3">-->
<!--            <b-form-input-->
<!--                v-model="dateUnloading"-->
<!--                type="text"-->
<!--            />-->
<!--            <b-input-group-append>-->
<!--              <b-form-datepicker-->
<!--                  v-model="dateUnloading"-->
<!--                  button-only-->
<!--                  right-->
<!--                  locale="ru-RU"-->
<!--              />-->
<!--            </b-input-group-append>-->
<!--          </b-input-group>-->
        </div>
      </div>

      <hr class="custom-hr"/>

      <div class="main-block pt-1">
        <div class="main-block__child">
          <label>Водитель</label>
          <b-form-select
              v-model="individual"
              :options="driverList"
              :disabled="!counterParty"
              :required="true"
          />
        </div>
        <div class="main-block__child child-block">
          <div class="child-block__subchild">
            <label>ТС</label>
            <b-form-select
                v-model="truck"
                :options="vehicleList"
                :disabled="!counterParty"
                :required="true"
                class="custom-select-short"
            />
          </div>
          <div class="child-block__subchild">
            <label>Прицеп</label>
            <b-form-select
                v-model="trailer"
                :options="trailerList"
                :disabled="!counterParty"
                class="custom-select-short"
            />
          </div>
        </div>
      </div>

      <hr class="custom-hr"/>

      <div class="float-end">
        <b-button
            variant="outline-primary"
            class="float-right"
            @click="closeModal"
        >
          Отмена
        </b-button>
        <b-button
            variant="primary"
            class="float-right"
            @click="saveData"
        >
          Добавить
        </b-button>
      </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "MLEditModal",
  data() {
    return{
      counterParty: '',
      contract: '',
      dateLoading: moment().format("DD.MM.YYYY"),
      dateUnloading: moment().add(2, "days").format("DD.MM.YYYY"),
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

    onContextLoading(ctx) {
      console.log(ctx.selectedFormatted)
      // this.dateLoading = ctx.selectedFormatted
    },

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
      this.closeModal();
    },

    closeModal() {
      this.$modal.hide('ml-modal');
    }
  }
}
</script>

<style lang="scss">

.main-block {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: left;

  .main-block__child {
    flex: 1 1 350px;
    display: flex;
    flex-direction: column;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  .child-block {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: left;

    .child-block__subchild {
      flex: 1 1 150px;
      display: flex;
      flex-direction: column;
      margin-left: 0.5em;
      margin-right: 0.5em;
    }
  }
}

.v-select {
  width: 100%;
}

.custom-hr {
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.custom-select {
  width: 100%;
  height: 34px;
  border-radius: 5px;
}
.custom-select-short {
  width: 100%;
  height: 34px;
  border-radius: 5px;
}
</style>