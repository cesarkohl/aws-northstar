/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.                                                                              *
 ******************************************************************************************************************** */
import { FC, useCallback } from 'react';
import TableComponent, { TableProps as CloudscapeTableProps } from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import { useCollection } from '@cloudscape-design/collection-hooks';

import TextFilter from '@cloudscape-design/components/text-filter';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import EmptyState from '../EmptyState';
import { BaseTableProps, InternalTableProps } from '../../types';
import {
    DEFAULT_TRACK_BY,
    DEFAULT_LOADING_TEXT,
    DEFAULT_PAGINATION_LABELS,
    DEFAULT_FILTERING_PLACEHOLDER,
    DEFAULT_FILTERING_ARIA_LABEL,
    getAriaLabels,
} from '../../config';

const FullDataTable: FC<BaseTableProps & InternalTableProps> = ({
    ariaLabels,
    columnDefinitions,
    items: allItems,
    disablePagination = false,
    pagination: paginationComponent,
    disableSettings = false,
    preferences: collectionPreferenceComponent,
    disableFilters = false,
    disableRowSelect = false,
    selectionType = 'multi',
    filter: filterComponent,
    selectedItems = [],
    header,
    trackBy = DEFAULT_TRACK_BY,
    collectionPreferences,
    onSelectionChange,
    defaultPageIndex,
    ...props
}) => {
    const { items, actions, collectionProps, filterProps, paginationProps } = useCollection(allItems, {
        filtering: {
            empty: <EmptyState title="No items" subtitle="No items to display." />,
            noMatch: (
                <EmptyState
                    title="No matches"
                    subtitle="We can’t find a match."
                    action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
                />
            ),
        },
        pagination: {
            pageSize: collectionPreferences.pageSize,
            defaultPage: defaultPageIndex,
        },
        sorting: {
            defaultState: { sortingColumn: columnDefinitions[0] },
        },
        selection: {
            defaultSelectedItems: selectedItems,
            trackBy,
        },
    });

    const collectionPropsOnSelectionChange = collectionProps.onSelectionChange;

    const handleSelectionChange: NonCancelableEventHandler<CloudscapeTableProps.SelectionChangeDetail<any>> =
        useCallback(
            (event: any) => {
                onSelectionChange?.(event);
                collectionPropsOnSelectionChange?.(event);
            },
            [onSelectionChange, collectionPropsOnSelectionChange]
        );

    return (
        <TableComponent
            trackBy={trackBy}
            loadingText={DEFAULT_LOADING_TEXT}
            visibleColumns={collectionPreferences.visibleContent}
            wrapLines={collectionPreferences.wrapLines}
            stripedRows={collectionPreferences.stripedRows}
            {...props}
            {...collectionProps}
            onSelectionChange={handleSelectionChange}
            selectionType={(!disableRowSelect && selectionType) || undefined}
            ariaLabels={ariaLabels || getAriaLabels()}
            columnDefinitions={columnDefinitions}
            items={items || []}
            pagination={
                !disablePagination &&
                (paginationComponent ?? <Pagination {...paginationProps} ariaLabels={DEFAULT_PAGINATION_LABELS} />)
            }
            preferences={collectionPreferenceComponent}
            filter={
                !disableFilters &&
                (filterComponent ?? (
                    <TextFilter
                        {...filterProps}
                        filteringPlaceholder={DEFAULT_FILTERING_PLACEHOLDER}
                        filteringAriaLabel={DEFAULT_FILTERING_ARIA_LABEL}
                    />
                ))
            }
            header={
                <Header
                    counter={
                        collectionProps.selectedItems?.length
                            ? `(${collectionProps.selectedItems.length}/${allItems.length})`
                            : `(${allItems.length})`
                    }
                    actions={props.actions}
                >
                    {header}
                </Header>
            }
        />
    );
};

export default FullDataTable;
