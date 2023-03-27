<template>
    <v-dialog v-model="open" width="auto" class="text-center">
      <template v-slot:activator="{ props }">
            <v-btn icon variant="text" @click="open=true"><v-icon>mdi-share-variant</v-icon></v-btn>
      </template>

      <v-card>
        <v-card-title class="d-flex justify-space-between pa-0">
            <span class="pt-2 pl-6">Share Your Experience</span>
            <v-btn color="primary" variant="text" icon @click="open=false"><v-icon x-large>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="text-center">
            <v-img width="auto" :src="qrCode" style="left: 50%; transform: translateX(-50%);"/>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
            <v-btn color="primary" variant="outlined" @click="copyQRCode()">Copy<v-icon x-large class="ml-2">mdi-qrcode</v-icon></v-btn>
            <span class="text-button ml-2">or</span>
            <v-btn color="primary" variant="outlined" @click="copyShareLink()">Copy<v-icon x-large class="ml-2">mdi-link</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script setup>
    import useDefaultStore from "@/stores";
    import QRCode from 'qrcode'

    const open = ref(false);
    const store = useDefaultStore();

    const qrCode = ref("");

    const generate_share_link = () => `${window.location.origin + window.location.pathname}share/?code=${store.share()}`;
    function copyShareLink()
    {
        navigator.clipboard.writeText(generate_share_link());
        store.show_notification("Share link copied.");
        open.value = false;
    }
    
    function copyQRCode()
    {
        navigator.clipboard.writeText(qrCode.value);
        store.show_notification("QR code copied.");
        open.value = false;
    }

    // alway generate the qr-code from latest values
    watch(open, async (opened) => 
    {
        if(opened)
        {
            try
            {
                qrCode.value = await QRCode.toDataURL(generate_share_link());
            }
            catch(err) 
            {
                console.error(err);
            }
        }
    });
</script>