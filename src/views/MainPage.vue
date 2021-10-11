<template>
  <div class="text-center pt-5">
    <b-button
        variant="primary"
        @click="showModal"
    >
      Добавить МЛ
    </b-button>
<!--    <b-button-->
<!--        variant="primary"-->
<!--        class="custom-button"-->
<!--    >-->
<!--      Закрыть-->
<!--    </b-button>-->
    <modal
        name="table-modal"
        height="100%"
        width="80%"
        :shiftX="1"
    >
      <TableModal/>
    </modal>
  </div>
</template>

<script>
import TableModal from "@/components/TableModal";

export default {
  name: "MainPage",
  components: {
    TableModal
  },
  methods: {
    showModal() {
      this.$modal.show('table-modal');
    }
  }
}
</script>

<style lang="scss">
//.custom-button {
//  top: 36px;
//  left: 14%;
//  display: block;
//  position: absolute;
//  border-radius: 20px 0 0 20px;
//}
</style>