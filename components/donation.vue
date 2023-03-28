<template>
    <v-dialog v-model="open" width="auto" persistent="">
      <template v-slot:activator="{ props }">
            <v-btn icon variant="text" @click="open=true"><v-icon>mdi-hand-heart-outline</v-icon></v-btn>
      </template>

      <v-card max-width="640px">
        <v-card-title class="d-flex justify-space-between px-6">
            <span>Feeling generous?</span>
            <v-btn color="primary" class="px-0" variant="text" @click="open=false">Not today <v-icon x-large>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="text-justify">
            <span class="text-caption">
                I sincerely hope that my assistance today has been of great help to you in your quest for financial independence. 
                After all, life is too precious to spend 40 hours a week toiling away for someone else, leaving little time for oneself. 
                This is precisely why I created this website - to aid you and others in your pursuit of early retirement. 
                It was not without time and effort that I brought this website to life, and if you have fund it valuable, 
                you can express your appreciation by treating me to a cup of coffee<v-icon small class="ml-2">mdi-account-heart</v-icon>. Of course, if you are unable to do so, simply sharing 
                this website with others would be a most welcome gesture as well.
            </span>
            <v-img width="250px" src="/life-is-money/img/paypal_qrcode.png" style="left: 50%; transform: translateX(-50%);"/>
        </v-card-text>
        <v-card-actions class="d-flex justify-center mx-4">
            <v-btn href="https://paypal.me/tstein88" target="_blank" color="primary" variant="outlined" block @click="">PayPal<v-icon x-large class="ml-2">mdi-cash-fast</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script setup>
    import useDefaultStore from "@/stores";

    const store = useDefaultStore();
    
    const open = ref(false);

	store.$onAction(({ name }) => { if(name === "show_donation") { open.value = true; } });

</script>