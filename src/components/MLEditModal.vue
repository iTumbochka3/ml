<template>
    <div class="p-5">
      <h1 class="h1-custom-header">Добавить маршрутный лист</h1>

      <div class="main-block pt-4">
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
          <date-picker
              class="custom-datepicker"
              v-model="dateLoading"
              format="DD.MM.YYYY"
              value-type="format"
          />
        </div>
        <div class="main-block__child">
          <label>Дата выгрузки</label>
          <date-picker
              class="custom-datepicker"
              v-model="dateUnloading"
              format="DD.MM.YYYY"
              value-type="format"
          />
        </div>
      </div>

      <hr class="custom-hr"/>

      <div class="main-block py-1">
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

      <div v-if="resultText" class="error-div">
        Ошибка: {{ resultText }}
      </div>

      <div class="button-div pt-4">
        <div class="button-div__child">
          <b-button
              variant="outline-primary"
              @click="closeModal"
          >
            Отмена
          </b-button>
        </div>
        <div class="button-div__child">
          <b-button
              v-if="currentSheet"
              variant="primary"
              @click=" editData"
          >
            Редактировать
          </b-button>
          <b-button
              v-else
              variant="primary"
              @click="saveData"
          >
            Добавить
          </b-button>
        </div>
      </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "MLEditModal",
  props: {
    'currentSheetIndex': {
      required: false,
      default() {
        return '';
      }
    },
    'currentSheet': {
      required: false,
      default() {
        return '';
      }
    },
  },
  mounted() {
    if (this.currentSheet) {
      this.initData();
    }
  },
  data() {
    return{
      counterParty: '',
      contract: '',
      dateLoading: moment().format("DD.MM.YYYY"),
      dateUnloading: moment().add(2, "days").format("DD.MM.YYYY"),
      individual: '',
      truck: '',
      trailer: '',
      resultText: '',
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

    initData() {
      this.counterParty = this.currentSheet.counterparty;
      this.contract = this.currentSheet.contract;
      this.dateLoading = this.currentSheet.date_loading;
      this.dateUnloading = this.currentSheet.date_unloading;
      this.individual = this.currentSheet.individual;
      this.truck = this.currentSheet.truck;
      this.trailer = this.currentSheet.trailer;
      this.resultText = this.currentSheet.result_text ? this.currentSheet.result_text : '';
    },

    async searchCounterparty(search) {
      await this.$store.dispatch('requestCounterPartyList', search)
    },

    setCounterParty(value) {
      this.counterParty = value;
      this.contract = '';
      this.individual = '';
      this.truck = '';
      this.trailer = '';
      this.$store.dispatch('requestContracts', value.uuid);
      this.$store.dispatch('requestDrivers', value.uuid);
      this.$store.dispatch('requestVehicles', value.uuid);
      this.$store.dispatch('requestTrailers', value.uuid);
    },

    saveData() {
      this.$store.dispatch('createSheet', {
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

    editData() {
      this.$store.dispatch('editSheet', {
        editIndex: this.currentSheetIndex,
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
      this.$store.dispatch('clearCounterPartyList');
      this.$emit('closeModal');
    }
  }
}
</script>

<style lang="scss">

.h1-custom-header {
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0px;
  color: #575757;
  text-align: center;
}

.main-block {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: left;
  font-size: 14px;
  color: #828282;

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

.error-div {
  margin-left: 0.5em;
  margin-right: 0.5em;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  text-align: left;
  color: #F2994A;
}

.button-div {
  display: flex;
  flex-direction: row;
  margin-left: 0.5em;
  margin-right: 0.5em;
  justify-content: end;

  .button-div__child {
    margin-left: 1em;
  }
}

.v-select {
  width: 100%;
  height: 39px !important;
  font-size: 16px;
  color: #575757;
   //31px
  .vs__dropdown-toggle {
    height: 39px !important;
    //31px
    .vs__selected-options {
      height: 33px !important;
      //25px
      .vs__search {
        height: 32px !important;
        //21px
      }
      .vs__selected {
        margin: 0 2px 0;
        height: 36px !important;
      }
    }
  }
}

.custom-hr {
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.custom-select {
  width: 100%;
  height: 39px;
  border-radius: 5px;
  font-size: 16px;
  color: #575757;
}
.custom-select-short {
  width: 100%;
  height: 39px;
  border-radius: 5px;
  font-size: 16px;
  color: #575757;
}

.custom-datepicker {
  width: 100% !important;
  height: 39px !important;
  .mx-input-wrapper {
    .mx-input {
      height: 39px !important;
    }
  }
}
</style>