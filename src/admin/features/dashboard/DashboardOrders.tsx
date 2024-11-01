import React, { useEffect, useState } from '@wordpress/element';
import {
	Card,
	CardBody,
	CardHeader,
	Dashicon,
	Flex,
	Spinner,
} from '@wordpress/components';
import { vfAPI } from '../../lib/vfAPI';
import type { Dashboard } from './Dashboard';

const apiUrl = '/stats/dashboard/';

export const DashboardOrders = () => {
	const minHeightInitial = { minHeight: 'initial' };

	const [isBusy, setIsBusy] = useState(true);
	const [orders, setOrders] = useState<Dashboard>();

	const toCurrency = (num: number): string => {
		return num.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
		});
	};

	const toGrowth = (last: number, prev: number) => {
		let icon = 'arrow-down-alt';
		if (last === prev) {
			icon = 'arrow-right-alt';
		} else if (last > prev) {
			icon = 'arrow-up-alt';
		}

		let colorClass = 'neutral';
		if (last > prev) {
			colorClass = 'profit';
		} else if (last < prev) {
			colorClass = 'loss';
		}

		if (last && prev) {
			return (
				<span className={colorClass}>
					<Dashicon icon={icon} />
					&nbsp;{Math.round((last / prev - 1) * 100)}%
				</span>
			);
		}
	};

	const getOrders = () => {
		setIsBusy(true);
		vfAPI
			.get(apiUrl)
			.then((response) => {
				if (response.data?.orders) {
					setOrders(response.data.orders);
				}
				setIsBusy(false);
			})
			.catch(() => {
				setIsBusy(false);
			});
	};

	useEffect(() => {
		getOrders();
	}, []);

	return (
		<>
			{isBusy && (
				<Flex justify={'center'}>
					<Spinner />
				</Flex>
			)}
			{orders && (
				<>
					<h3>Gross revenue</h3>
					<section className="revenue">
						<Card>
							<Flex direction="column" expanded={true}>
								<CardHeader style={minHeightInitial}>
									Today
								</CardHeader>
								<CardBody>
									<strong>
										<span className="total">
											{toCurrency(orders.today_totals)}
										</span>
									</strong>
									<p>
										{orders.today
											? orders.today.toLocaleString()
											: 'No'}{' '}
										orders
									</p>
								</CardBody>
							</Flex>
						</Card>
						<Card>
							<Flex direction="column" expanded={true}>
								<CardHeader style={minHeightInitial}>
									Last 7 days
								</CardHeader>
								<CardBody>
									<Flex justify={'space-between'}>
										<strong>
											<span className="total">
												{toCurrency(
													orders.last7_totals
												)}
											</span>
											{orders.last7 > 0 && (
												<small>
													{' '}
													(
													{orders.last7.toLocaleString()}{' '}
													order
													{orders.last7 > 1
														? 's'
														: ''}
													)
												</small>
											)}
										</strong>
										{toGrowth(
											orders.last7_totals,
											orders.prev7_totals
										)}
									</Flex>
									<p>
										Previous 7 days:{' '}
										{toCurrency(orders.prev7_totals)}
										{orders.prev7 > 0 && (
											<small>
												{' '}
												({orders.prev7.toLocaleString()}{' '}
												order
												{orders.prev7 > 1 ? 's' : ''})
											</small>
										)}
									</p>
								</CardBody>
							</Flex>
						</Card>
						<Card>
							<Flex direction="column" expanded={true}>
								<CardHeader>Last 30 days</CardHeader>
								<CardBody>
									<Flex justify={'space-between'}>
										<strong>
											<span className="total">
												{toCurrency(
													orders.last30_totals
												)}
											</span>
											{orders.last30 > 0 && (
												<small>
													{' '}
													(
													{orders.last30.toLocaleString()}{' '}
													order
													{orders.last30 > 1
														? 's'
														: ''}
													)
												</small>
											)}
										</strong>
										{toGrowth(
											orders.last30_totals,
											orders.prev30_totals
										)}
									</Flex>
									<p>
										Previous 30 days:{' '}
										{toCurrency(orders.prev30_totals)}
										{orders.prev30 > 0 && (
											<small>
												{' '}
												(
												{orders.prev30.toLocaleString()}{' '}
												order
												{orders.prev30 > 1 ? 's' : ''})
											</small>
										)}
									</p>
								</CardBody>
							</Flex>
						</Card>
					</section>
				</>
			)}
		</>
	);
};
