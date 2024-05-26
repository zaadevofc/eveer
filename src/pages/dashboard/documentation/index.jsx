'use client'

import Layouts from '../../../components/dashboard/Layouts';
import SwaggerUI from "swagger-ui-react"

const DocumentationPage = () => {
  return (
    <div>
      <Layouts title={'Dokumentasi Penggunaan APi'}>
        <SwaggerUI url="/docs.json" />
      </Layouts>
    </div>
  );
};

export default DocumentationPage;
