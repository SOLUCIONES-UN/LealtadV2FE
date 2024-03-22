const customGridOptions = {
    enableSearch: true,
    searchBar: true,
    headerClass: 'text-center',
    cellStyle: {
        'textAlign': 'center',
        'height': '100%',
        'display': 'flex ',
        //'justify-content': 'flex-start',
        'justify-content': 'center',
        //'justify-content': 'flex-end',
        'align-items': 'center '
    },
    cellClass: 'cell-wrap-text',
    cellClassRules: 'no-border-cell',
    rowStyle: { outline: 'none' },
    suppressCellFlash: true,
    enableCellChangeFlash: true,
    cacheQuickFilter: true,
    defaultColDef: {
        width: 500,
        //editable: true,
        sortable: true,
        resizable: true,
        filter: true,
        filter: 'agTextColumnFilter',
        getQuickFilterText: params => params.colDef.hide ? '' : params.value
    },
    defaultColGroupDef: {
        marryChildren: true,
    },
    rowGroupPanelShow: 'always',
    rowSelection: 'multiple',
    statusBar: {
        items: [
            { component: 'agAggregationComponent' }
        ]
    },
    sideBar: true,
    pagination: true,
    //rowModelType: 'infinite',
    enableSorting: true,
    enableFilter: true,
    enableColResize: true,
    floatingFilter: true,
    cacheBlockSize: 100,
    paginationPageSize: 100,
    paginateChildRows: true,
    paginationAutoPageSize: false,
    paginationPageSizeOptions: [5, 10, 20, 50, 100, 500, 1000],
    enableRangeSelection: true,
    suppressCellSelection: false,
    suppressContextMenu: false,
    enableCharts: true,
    suppressDragLeaveHidesColumns: false,
    animateRows: true,
    deltaRowDataMode: true,
    groupDefaultExpanded: 1,
    getRowId: params => params.data.id,
    getRowNodeId: data => data.id,
    onGridReady: event => console.log('Grid is ready.'),
    onFirstDataRendered: event => console.log('Data got rendered.'),
    onColumnResized: columnNode => console.log(`Column resized: ${columnNode.rowIndex}`),
    onRowDataChanged: event => console.log(`Data got changed. ${rowNode.rowIndex}`),
    onRowAdded: rowNode => console.log(`Row got added. ${rowNode.rowIndex}`),
    onRowRemoved: rowNode => console.log(`Row got removed. ${rowNode.rowIndex}`),
    onRowSelected: rowNode => console.log(`Row selected: ${rowNode.rowIndex}`),
    onRowDeselected: rowNode => console.log(`Row deselected: ${rowNode.rowIndex}`),
    onRowClicked: rowNode => console.log(`Row clicked: ${rowNode.rowIndex}`),
    onRowExpand: rowNode => console.log(`Row expand: ${rowNode.rowIndex}`),
    onRowCollapse: rowNode => console.log(`Row collapse: ${rowNode.rowIndex}`),
    onCellClick: cellNode => console.log(`Cell clicked: ${cellNode.rowIndex}`),
    onCellContextMenu: cellNode => console.log(`Cell context menu: ${cellNode.rowIndex}`),
    //onFilterTextBoxChanged: filterValue => agGrid.setQuickFilter(filterValue),
    api: {
        quickFilterText: '',
        //onFilterTextBoxChanged: text => myGrid.setQuickFilter(text)
    },
    components: {
        rowNodeIdRenderer: params => params.node.id + 1
    },
    localeText: {

        page: 'Página',
        pageLastRowUnknown: '?',
        nextPage: 'Siguiente Página',
        lastPage: 'Última Página',
        firstPage: 'Primera Página',
        previousPage: 'Página Anterior',
        pageSizeSelectorLabel: 'Número de Página:',
        footerTotal: 'Total',
        pivotColumnGroupTotals: 'Total',
        pivotChartAndPivotMode: 'Gráfica Dinámica y Modo Dinámico',
        pivotChart: 'Gŕafica Dinámica',
        chartRange: 'Gráfica de Rango',

        more: 'Más',
        to: 'a',
        of: 'de',
        next: 'Siguente',
        last: 'Último',
        first: 'Primero',
        previous: 'Anteror',
        loadingOoo: 'Cargando...',

        selectAll: 'Seleccionar Todo',
        searchOoo: 'Buscar...',
        blanks: 'En blanco',

        filterOoo: 'Filtrar',
        applyFilter: 'Aplicar Filtro...',
        equals: 'Igual',
        notEqual: 'No Igual',

        lessThan: 'Menos que',
        greaterThan: 'Mayor que',
        lessThanOrEqual: 'Menos o igual que',
        greaterThanOrEqual: 'Mayor o igual que',
        inRange: 'En rango de',

        contains: 'Contiene',
        notContains: 'No contiene',
        startsWith: 'Empieza con',
        endsWith: 'Termina con',

        andCondition: 'Y',
        orCondition: 'O',

        group: 'Grupo',

        columns: 'Columnas',
        filters: 'Filtros',
        valueColumns: 'Valos de las Columnas',
        pivotMode: 'Modo Pivote',
        groups: 'Grupos',
        values: 'Valores',
        pivots: 'Pivotes',
        toolPanelButton: 'BotonDelPanelDeHerramientas',

        noRowsToShow: 'No hay filas para mostrar',

        pinColumn: 'Columna Pin',
        valueAggregation: 'Agregar valor',
        autosizeThiscolumn: 'Autoajustar esta columna',
        autosizeAllColumns: 'Ajustar todas las columnas',
        groupBy: 'agrupar',
        ungroupBy: 'desagrupar',
        resetColumns: 'Reiniciar Columnas',
        expandAll: 'Expandir todo',
        collapseAll: 'Colapsar todo',
        toolPanel: 'Panel de Herramientas',
        export: 'Exportar',
        csvExport: 'Exportar a CSV',
        excelExport: 'Exportar a Excel (.xlsx)',
        excelXmlExport: 'Exportar a Excel (.xml)',

        pinLeft: 'Pin Izquierdo',
        pinRight: 'Pin Derecho',

        sum: 'Suman',
        min: 'Minimo',
        max: 'Maximo',
        none: 'nada',
        count: 'contar',
        average: 'promedio',

        copy: 'Copiar',
        copyWithHeaders: 'Copiar con cabeceras',
        paste: 'Pegar',

    }
}

//export { customGridOptions };