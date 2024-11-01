import { IScope } from 'angular';

PaymentProcessorController.$inject = ['$scope', '$parse'];

interface Scope extends IScope {
	attributeCount: number;
	attributeIndex1: string;
	attributeIndex2: string;
	attributeIndex3: string;
	attributeIndex4: string;
	attributeIndex5: string;
	initPayfabric: () => void;
	processorIndex: string;
}

export function PaymentProcessorController(
	$scope: Scope,
	$parse: ng.IParseService
) {
	/**
	 * Initialization
	 */
	this.init = () => {
		$scope.attributeCount = 0;
		$scope.enabled = 0;
		$scope.processorIndex = null;

		$scope.$watch('$viewContentLoaded', () => {
			if ($scope.$parent.gateways[$scope.processorIndex]) {
				const gateway = $scope.$parent.gateways[$scope.processorIndex];
				$scope.enabled = Number(gateway.enabled);
				let i = 1;
				angular.forEach(gateway, (value, key) => {
					if (key !== 'enabled') {
						let index = 'atrributeIndex';
						let valueIndex = 'attribute';
						index = index.concat(i);
						valueIndex = valueIndex.concat(i);
						$parse(index).assign($scope, key);
						$parse(valueIndex).assign($scope, value);
						i++;
					}
				});
			} else {
				for (let j = 1; j <= $scope.attributeCount; ) {
					let valueIndex = 'attribute';
					valueIndex = valueIndex.concat(j);
					$parse(valueIndex).assign($scope, '');
					j++;
				}
			}
		});
	};
	this.init();

	$scope.initPayfabric = (): void => {
		$scope.processorIndex = 'payfabric';
		$scope.attributeIndex1 = 'deviceId';
		$scope.attributeIndex2 = 'password';
		$scope.attributeIndex3 = 'setupId';
		$scope.attributeIndex4 = 'transactionType';
		$scope.attributeIndex5 = 'shipFromZip';
		$scope.attributeCount = 5;
	};

	$scope.updateGateway = () => {
		const gateway: any = {};
		gateway[$scope.processorIndex] = {};
		gateway[$scope.processorIndex].enabled = $scope.enabled;

		for (let i = 1; i <= $scope.attributeCount; ) {
			let index = 'attributeIndex';
			let valueIndex = 'attribute';
			index = index.concat(i.toString());
			valueIndex = valueIndex.concat(i.toString());
			if ($scope[index] !== 'enabled') {
				gateway[$scope.processorIndex][$scope[index]] =
					$scope[valueIndex];
				i++;
			}
		}

		$scope.$parent.gateways[$scope.processorIndex] =
			gateway[$scope.processorIndex];
		$scope.$parent.updateGateway(gateway);
	};

	$scope.disableGateway = () => {
		const gateway: any = {};
		gateway[$scope.processorIndex] = {};
		gateway[$scope.processorIndex].enabled = false;

		$scope.$parent.gateways[$scope.processorIndex] =
			gateway[$scope.processorIndex];
		$scope.$parent.disableGateway(gateway).then();
	};

	$scope.setPrimaryCCProcessor = () => {
		const gateway: any = {};
		gateway[$scope.processorIndex] = {};
		if ($scope.keyIndex !== '') {
			gateway[$scope.processorIndex][$scope.keyIndex] = $scope.key;
		}
		if ($scope.secretIndex !== '') {
			gateway[$scope.processorIndex][$scope.secretIndex] = $scope.secret;
		}
		gateway[$scope.processorIndex].enabled = $scope.enabled;

		$scope.$parent.gateways[$scope.processorIndex] =
			gateway[$scope.processorIndex];

		$scope.$parent.setPrimaryCCProcessor(gateway);
	};

	$scope.authorizeAccess = () => {
		$scope.$parent.authorizeAccess($scope.processorIndex);
	};
	$scope.revokeAccess = () => {
		$scope.$parent.revokeAccess($scope.processorIndex);
	};
}
