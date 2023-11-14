import { Document, Image, PDFViewer, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'

const pdf = ({ data }) => {
    return (
      <PDFViewer>
        <Document>
          <Page>
            <Image
              src={`${
                process.env.NEXT_PUBLIC_RESTFUL_API != undefined
                  ? process.env.NEXT_PUBLIC_RESTFUL_API
                  : ""
              }/event/gambar/${data.gambar}`}
            />
            <View style={{ paddingHorizontal: 30 }}>
              <Text style={{ marginTop: 10 }}>
                {data.tanggalMulai + " s/d " + data.tanggalSelesai}
              </Text>
              <Text style={{ marginTop: 20, fontSize: 30, fontWeight: "bold" }}>
                {data.nama}
              </Text>
              <Text style={{ fontSize: 18 }}>{data.nagari}</Text>
              <Text style={{ fontSize: 14 }}>{data.status}</Text>
              <Text style={{ fontSize: 12 }}>{data.deskripsi}</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ textAlign: "center" }}>
                Hanzu - Event Organizer
              </Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
}

export default pdf