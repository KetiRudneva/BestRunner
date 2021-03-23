import React from 'react';

interface TableContainerProps {
    children: any
}

/**
 * Компонент-контейнер для таблицы
 *
 * @param props
 * @constructor
 */
export const TableContainer = (props: TableContainerProps) => {
    return <div className="table">
        {props.children}
    </div>
}
