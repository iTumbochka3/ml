<template>
  <div class="text-center pt-5">
    <b-button
        variant="primary"
        @click="showModal"
    >
      Добавить МЛ
    </b-button>
    <modal name="table-modal">
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
</style>